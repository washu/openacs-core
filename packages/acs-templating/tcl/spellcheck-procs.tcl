ad_library {
    Spell-check library for OpenACS templating system.

    @author Ola Hansson (ola@polyxena.net)
    @creation-date 2003-09-21
    @cvs-id $Id$
}

namespace eval template {}
namespace eval template::data {}
namespace eval template::data::transform {}
namespace eval template::util {}
namespace eval template::util::spellcheck {}

ad_proc -public template::util::spellcheck { command args } {
    Dispatch procedure for the spellcheck object
} {
  eval template::util::spellcheck::$command $args
}

ad_proc -public template::util::spellcheck::merge_text { element_id } {
    Returns the merged (possibly corrected) text or the empty string
    if it is not time to merge.
} {

    set __form__ [ns_getform]
    set merge_text [ns_set get $__form__ $element_id.merge_text]
    ns_set delkey $__form__ $element_id.merge_text

    if { [empty_string_p $merge_text] } {
	return {}
    } 

    # loop through errors and substitute the corrected words for #errnum#.
    set i 0
    while { [ns_set find $__form__ $element_id.error_$i] != -1 } {
	regsub "\#$i\#" $merge_text [ns_set get $__form__ $element_id.error_$i] merge_text
	ns_set delkey $__form__ $element_id.error_$i
	incr i
    }

    ns_set cput $__form__ $element_id $merge_text
    ns_set cput $__form__ $element_id.spellcheck ":nospell:"

    return $merge_text
}

ad_proc -public template::data::transform::spellcheck {
    -element_ref:required
    -values:required
} {
    upvar $element_ref element

    # case 1, initial submission of non-checked text: returns {}.
    # case 2, submission of the page showing errors: returns the corrected text.
    set merge_text [template::util::spellcheck::merge_text $element(id)]

    if { [set richtext_p [string equal "richtext" $element(datatype)]] } {
	# special treatment for the "richtext" datatype.
    	set format [template::util::richtext::get_property format [lindex $values 0]]
	if { ![empty_string_p $merge_text] } {
	    return [list [list $merge_text [ns_queryget $element(id).format]]]
	} 
    	set contents [template::util::richtext::get_property contents [lindex $values 0]]
    } else {
	if { ![empty_string_p $merge_text] } {
	    return [list $merge_text]
	} 
	set contents [lindex $values 0]
    }

    if { [empty_string_p $contents] } {
	return [list]
    } 

    set spellcheck_p [ad_decode [set language [ns_queryget $element(id).spellcheck]] ":nospell:" 0 1]

    # perform spellchecking or not?
    if { $spellcheck_p } { 

	template::util::spellcheck::get_element_formtext \
	    -text $contents \
	    -var_to_spellcheck $element(id) \
	    -language $language \
	    -error_num_ref error_num \
	    -formtext_to_display_ref formtext_to_display \
	    -just_the_errwords_ref {} \
	    -html
	
	if { $error_num > 0 } {
	    # there was at least one error.

	    template::element::set_error $element(form_id) $element(id) "
          [ad_decode $error_num 1 "Found one error." "Found $error_num errors."] Please correct, if necessary."

	    # switch to display mode so we can show our inline mini-form with suggestions.
	    template::element::set_properties $element(form_id) $element(id) mode display

	    if { $richtext_p } {
		append formtext_to_display "
<input type=\"hidden\" name=\"$element(id).format\" value=\"$format\" />"
	    }

	    # This is needed in order to display the form text noquoted in the "show errors" page ...
	    template::element::set_properties $element(form_id) $element(id) -display_value $formtext_to_display

	    set contents $formtext_to_display
	}
    }
        
    # no spellchecking was to take place, or there were no errors.
    if { $richtext_p } {
	return [list [list $contents $format]]
    } else {
	return [list $contents]
    }
}

ad_proc -public template::util::spellcheck::get_sorted_list_with_unique_elements {
    -the_list:required
} {
    
    Converts a list of possibly duplicate elements (words) into a sorted list where no duplicates exist.
    
    @param the_list The list of possibly duplicate elements.
    
} {
    
    set sorted_list [lsort -dictionary $the_list]
    set new_list [list]
    
    set old_element "XXinitial_conditionXX"
    foreach list_element $sorted_list {
	if { ![string equal $list_element $old_element] } {
	    lappend new_list $list_element
	}
	set old_element $list_element
    }
    
    return $new_list
    
}

ad_proc -public template::util::spellcheck::get_element_formtext {
    -text:required
    {-html:boolean 0}
    -var_to_spellcheck:required
    {-language ""}
    -error_num_ref:required
    -formtext_to_display_ref:required
    {-just_the_errwords_ref ""}
} {

    @param text The string to check for spelling errors.
    
    @param html_p Does the text have html in it? If so, we strip out html tags in the string we feed to ispell (or aspell).
    
    @param var_to_spellcheck The name of the text input type or textarea that holds this text (eg., "email_body")
    
} {

    # We need a "var_to_spellcheck" argument so that we may name the hidden errnum vars
    # differently on each input field by prepending the varname.

    set text_to_spell_check $text

    # if HTML then substitute out all HTML tags
    if { $html_p } {
	regsub -all {<[^<]*>} $text_to_spell_check "" text_to_spell_check
    }

    set tmpfile [ns_mktemp "/tmp/webspellXXXXXX"]
    set f [open $tmpfile w]
    puts $f $text_to_spell_check
    close $f
    
    set lines [split $text "\n"]

    # Support for local, localized, dictionaries (UI to add to them is not implemented yet!)
    set suffix [ad_decode $language "" "" "-$language"]
    set dictionaryfile [file join [acs_package_root_dir acs-templating] resources forms webspell-local-dict$suffix]

    # The webspell wrapper is necessary because ispell requires
    # the HOME environment set, and setting env(HOME) doesn't appear
    # to work from AOLserver.

    set spelling_wrapper [file join [acs_root_dir] bin webspell]

    set spellchecker_path [nsv_get spellchecker path]

    # the --lang switch only works with aspell and if it is not present
    # aspell's (or ispell's) default language will have to do.
    if { ![empty_string_p $language] } {
	set language "--lang=$language"
    }

    # Caveat: The "open" arg must be a list (not a string) to allow the wrapper args to be the empty string
    # (which $language will be when ispell is used, for instance)

    if { [catch { set ispell_proc [open [list |$spelling_wrapper [ns_info home] $spellchecker_path $language $dictionaryfile $tmpfile] r] } errmsg] } {
	ad_return_error "Webspell could not be executed" "Spell-checking is enabled but the spell-check wrapper ([acs_root_dir]/bin/webspell) could not be executed. Check that the wrapper exists, and that its permissions are correct. <p>Here is the error message: <pre>$errmsg</pre>"
	ad_script_abort
    }
    
    # read will occasionally error out with "interrupted system call",
    # so retry a few times in the hopes that it will go away.
    set try 0
    set max_retry 10
    while { [catch { set ispell_text [read -nonewline $ispell_proc] } errmsg]
	    && $try < $max_retry } {
	incr try
	ns_log warning "template::util::spellcheck::get_element_formtext: spellchecker had a problem: $errmsg"
    }

    fconfigure $ispell_proc -blocking 0
    
    if { [catch { close $ispell_proc } errmsg] } {
	ad_return_error "No dictionary found" "Spell-checking is enabled but the spell-check dictionary could not be reached. Check that the dictionary exists, and that its permissions are correct. <p>Here is the error message: <pre>$errmsg</pre>"
	ad_script_abort
    }

    ns_unlink $tmpfile

    if { $try == $max_retry } {
        return -code error "webspell: Tried to execute spellchecker $max_retry times but it did not work out. Sorry!"
    }

    ####
    #
    # Ispell is done. Start manipulating the result string.
    #
    ####
    
    set ispell_lines [split $ispell_text "\n"]
    # Remove the version line.
    if { [llength $ispell_lines] > 0 } {
	set ispell_lines [lreplace $ispell_lines 0 0]
    }

    ####
    # error_num
    ####
    upvar $error_num_ref error_num

    set error_num 0
    set errors [list]
    
    set processed_text ""

    set line [lindex $lines 0]

    foreach ispell_line $ispell_lines {
	switch -glob -- $ispell_line {
	    \#* {
		regexp "^\# (\[^ \]+) (\[0-9\]+)" $ispell_line dummy word pos
		regsub $word $line "\#$error_num\#" line
		lappend errors [list miss $error_num $word dummy]
		incr error_num
	    }
	    &* {
		regexp {^& ([^ ]+) ([0-9]+) ([0-9]+): (.*)$} $ispell_line dummy word n_options pos options
		regsub $word $line "\#$error_num\#" line
		lappend errors [list nearmiss $error_num $word $options]
		incr error_num
	    }
	    "" {
		append processed_text "$line\n"
		if { [llength $lines] > 0 } {
		    set lines [lreplace $lines 0 0]
		    set line [lindex $lines 0]
		}
	    }
	}
    }

    set formtext $processed_text

    set error_list [join $errors]

    foreach { errtype errnum errword erroptions } $error_list {
	set wordlen [string length $errword]
	
	if { [string equal "miss" $errtype] } {
	    regsub "\#$errnum\#" $formtext "<input type=\"text\" name=\"${var_to_spellcheck}.error_$errnum\" value=\"$errword\" size=\"$wordlen\" />" formtext
	} elseif { [string equal "nearmiss" $errtype] } {
	    regsub -all ", " $erroptions "," erroptions
	    set options [split $erroptions ","]
	    set select_text "<select name=\"${var_to_spellcheck}.error_$errnum\">\n<option value=\"$errword\">$errword</option>\n"
	    foreach option $options {
		append select_text "<option value=\"$option\">$option</option>\n"
	    }
	    append select_text "</select>"
	    regsub "\#$errnum\#" $formtext $select_text formtext
	}
    }
    
    ####
    # formtext_to_display
    ####
    upvar $formtext_to_display_ref formtext_to_display

    regsub -all "\r\n" $formtext "<br>" formtext_to_display

    # We replace <a></a> with  <u></u> because misspelled text in link titles
    # would lead to strange browser behaviour where the select boxes with the 
    # proposed changes would itself be a link!!!
    # It seemed like an okay idea to make the text underlined so it would a) work,
    # b) still resemble a link ...
    regsub -all {<a [^<]*>} $formtext_to_display "<u>" formtext_to_display
    regsub -all {</a>} $formtext_to_display "</u>" formtext_to_display

    append formtext_to_display "<input type=\"hidden\" name=\"${var_to_spellcheck}.merge_text\" value=\"[ad_quotehtml $processed_text]\" />"


    ####
    # just_the_errwords
    ####

    if { ![empty_string_p $just_the_errwords_ref]} {
	
	upvar $just_the_errwords_ref just_the_errwords
	
	set just_the_errwords [list]
	foreach err $errors {
	    lappend just_the_errwords [lindex $err 2]
	}   
	
    }
}

ad_proc -public template::util::spellcheck::spellcheck_properties {
    -element_ref:required
} {
    Returns a list of spellcheck properties in array setable format.
} {
    upvar $element_ref element
    
    if { [empty_string_p [set spellcheck_value [ns_queryget $element(id).spellcheck]]] } {
	
	# The user hasn't been able to state whether (s)he wants spellchecking to be performed or not.
	# That's either because spell-checking is disabled for this element, or we're not dealing with a submit.
	# Whichever it is, let's see if, and then how, we should render the spellcheck "sub widget".
	
	if { [empty_string_p [nsv_get spellchecker path]] } {

	    # The aspell or ispell binary was not found during server startup - turn spell-checking off.
	    set spellcheck_p 0

	} else {

	    array set widget_info [string trim [parameter::get_from_package_key \
						    -package_key acs-templating \
						    -parameter SpellcheckFormWidgets \
						    -default ""]]
	    
	    set spellcheck_p [expr [array size widget_info] \
				  && ![info exists element(nospell)] \
				  && ([string equal $element(widget) "richtext"] || [string equal $element(widget) "textarea"] || [string equal $element(widget) "text"]) \
				  && [lsearch -exact [array names widget_info] $element(widget)] != -1]
	    
	}
	
	if { $spellcheck_p } {
	    # This is not a submit; we are rendering the form element for the first time and
	    # since the spellcheck "sub widget" is to be displayed we'll also want to know
	    # which option should be selected by default.

	    set spellcheck(render_p) 1
	    set spellcheck(perform_p) 1

	    if { $widget_info(${element(widget)}) } {
		set spellcheck(selected_option) [nsv_get spellchecker default_lang]
	    } else {
		set spellcheck(selected_option) ":nospell:"
	    }

	} else {

	    set spellcheck(render_p) 0
	    set spellcheck(perform_p) 0

	    # set this to something so the script won't choke.
	    set spellcheck(selected_option) ":nospell:"
	}
	
    } else {
	
	# The user has explicitly stated if (s)he wants spellchecking to be performed
	# on the text or not. Hence we are in submit mode with spell-checking enabled.
	# Let's check which it is and keep record of the states of our select menu in
	# case the error page is shown (because of an error in a neighboring element).

	set spellcheck(selected_option) $spellcheck_value
	set spellcheck(render_p) 1

	if { [string equal ":nospell:" $spellcheck(selected_option)] } {
	    set spellcheck(perform_p) 0
	} else {
	    set spellcheck(perform_p) 1
	}
    }

    return [array get spellcheck]
}
