ad_library {

    Postgres-specific database API and utility procs.

    @creation-date 15 Apr 2000
    @author Jon Salz (jsalz@arsdigita.com)
    @cvs-id $Id$
}

proc db_current_rdbms {} {
    return [db_rdbms_create postgresql "7.1"]
}

proc_doc db_nextval { sequence } { Returns the next value for a sequence. This can utilize a pool of sequence values to save hits to the database. } {
    return [db_string nextval "select nextval('$sequence')"]
}

proc_doc db_exec_plsql { statement_name sql args } {

    Postgres doesn't have PL/SQL, of course, but it does have PL/pgSQL and
    other procedural languages.  Rather than assign the result to a bind
    variable which is then returned to the caller, the Postgres version of
    OpenACS requires the caller to perform a select query that returns
    the value of the function.

} {
    ad_arg_parser { bind_output } $args
    if { [info exists bind_output] } {
	return -code error "the -bind_output switch is not currently supported"
    }

    db_with_handle db {
	return [db_string $statement_name $sql]
    }
}

ad_proc -private db_exec { type db statement_name sql args } {

    A helper procedure to execute a SQL statement, potentially binding
    depending on the value of the $bind variable in the calling environment
    (if set).

} {
    set start_time [clock clicks]

    ns_log Notice "PRE-QD: the SQL is $sql"

    # Query Dispatcher (OpenACS - ben)
    set sql [db_fullquery_replace_sql $statement_name $sql]

    ns_log Notice "POST-QD: the SQL is $sql"

    set errno [catch {
	upvar bind bind
	if { [info exists bind] && [llength $bind] != 0 } {
	    if { [llength $bind] == 1 } {
		return [eval [list ns_pg_bind $type $db -bind $bind $sql] $args]
	    } else {
		set bind_vars [ns_set create]
		foreach { name value } $bind {
		    ns_set put $bind_vars $name $value
		}
		return [eval [list ns_pg_bind $type $db -bind $bind_vars $sql] $args]
	    }
	} else {
	    return [uplevel 2 [list ns_pg_bind $type $db $sql] $args]
	}
    } error]

    ad_call_proc_if_exists ds_collect_db_call $db $type $statement_name $sql $start_time $errno $error
    if { $errno == 2 } {
	return $error
    }

    global errorInfo errorCode
    return -code $errno -errorinfo $errorInfo -errorcode $errorCode $error
}

proc_doc db_dml { statement_name sql args } {
    Do a DML statement.  We don't have CLOBs in PG as PG 7.1 allows
    unbounded compressed text columns.  BLOBs are handled much differently,
    to.
} {
    ad_arg_parser { bind } $args

    db_with_handle db {
	db_exec dml $db $statement_name $sql
    }
}

proc_doc db_resultrows {} { Returns the number of rows affected by the last DML command. } {
    global db_state
    return [ns_pg ntuples $db_state(last_used)]
}

#ad_proc db_continue_transaction {} {
#    
#    If a transaction is set to be aborted, this procedure allows it to continue.
#    Intended for use only within a db_transaction on_error code block.  
#
#    DRB: we can't emulate this in Postgres.  The best we can do is a COMMIT
#    followed by BEGIN.  Commented out so caller will get an error.
#
#} {
#    global db_state
#    db_with_handle db {
#	# The error has been handled, set the flag to false.
#	set db_state(db_abort_p,$db) 0
#    }
#}

ad_proc db_write_clob { statement_name sql args } {
    ad_arg_parser { bind } $args

    db_with_handle db {
	db_exec write_clob $db $statement_name $sql
    }
}

ad_proc db_write_blob { statement_name sql args } {
    ad_arg_parser { bind } $args

    db_with_handle db { 
	db_exec write_blob $db $statement_name $sql
    }
}

ad_proc db_blob_get_file { statement_name sql args } {
    ad_arg_parser { bind file args } $args

    db_with_handle db {
	eval [list db_exec blob_get_file $db $statement_name $sql $file] $args
    }
}

ad_proc db_get_pgbin { } {

    Returns the database name from the first database pool.  It assumes the 
    datasource is properly formatted since we've already verified that we
    can connect to the pool.

} {

    set pool [lindex [nsv_get db_available_pools .] 0]
    set driver [ns_config ns/db/pool/$pool Driver]    
    return [ns_config ns/db/driver/$driver pgbin]
}

ad_proc db_get_database { } {

    Returns the database name from the first database pool.  It assumes the 
    datasource is properly formatted since we've already verified that we
    can connect to the pool.

} {

    set pool [lindex [nsv_get db_available_pools .] 0]
    set datasource [ns_config ns/db/pool/$pool DataSource]    
    set last_colon_pos [string last ":" $datasource]
    if { $last_colon_pos == -1 } {
        ns_log Error "datasource contains no \":\"? datasource = $datasource"
        return ""
    }
    return [string range $datasource [expr $last_colon_pos + 1] end]
}

ad_proc db_source_sql_file { {-callback apm_ns_write_callback} file } {

    Sources a SQL file (in SQL*Plus format).

} {
    
    set fp [open "|[file join [db_get_pgbin] psql] [db_get_database] -f $file" "r"]

    while { [gets $fp line] >= 0 } {
	# Don't bother writing out lines which are purely whitespace.
	if { ![string is space $line] } {
	    apm_callback_and_log $callback "[ad_quotehtml $line]\n"
	}
    }

    # PSQL dumps errors and notice information on stderr, and has no option to turn
    # this off.  So we have to chug through the "error" lines looking for those that
    # really signal an error.

    set errno [ catch {
        close $fp
    } error]

    if { $errno == 2 } {
	return $error
    }

    # Just filter out the "NOTICE" lines, so we get the stack dump along with real
    # ERRORs.  This could be done with a couple of opaque-looking regexps...

    set error_found 0
    foreach line [split $error "\n"] {
        if { [string first NOTICE $line] == -1 } {
            append error_lines "$line\n"
            set error_found [expr { $error_found || [string first ERROR $line] != -1 } ]
        }
    }

    if { $error_found } {
        global errorCode
        return -code error -errorinfo $error_lines -errorcode $errorCode
    }
}

ad_proc -public db_tables { -pattern } {
    Returns a Tcl list of all the tables owned by the connected user.
    
    @param pattern Will be used as LIKE 'pattern%' to limit the number of tables returned.

    @author Don Baccus dhogaza@pacifier.com

} {
    set tables [list]
    
    if { [info exists pattern] } {
	db_foreach table_names_with_pattern {
	    select relname
	    from pg_class
	    where relname like lower(:pattern) and
                relname !~ '^pg_' and relkind = 'r'
	} {
	    lappend tables $relname
	}
    } else {
	db_foreach table_names_without_pattern {
	    select relname
	    from pg_class
	    where relname !~ '^pg_' and relkind = 'r'
	} {
	    lappend tables $relname
	}
    }
    return $tables
}

ad_proc -public db_table_exists { table_name } {
    Returns 1 if a table with the specified name exists in the database, otherwise 0.

    @author Don Baccus dhogaza@pacifier.com
    
} {
    set n_rows [db_string table_count {
	select count(*) from pg_class
        where relname = lower(:table_name) and
	    relname !~ '^pg_' and relkind = 'r'
    }]
    return $n_rows
}

ad_proc -public db_columns { table_name } {
    Returns a Tcl list of all the columns in the table with the given name.
    
    @author Lars Pind lars@pinds.com

    @change-log yon@arsdigita.com 20000711 changed to return lower case column names
} {
    set columns [list]
    db_foreach table_column_names {
	select lower(column_name) as column_name
	from user_tab_columns
	where table_name = upper(:table_name)
    } {
	lappend columns $column_name
    }
    return $columns
}


ad_proc -public db_column_exists { table_name column_name } {
    Returns 1 if the row exists in the table, 0 if not.
    
    @author Lars Pind lars@pinds.com
} {
    set columns [list]
    set n_rows [db_string column_exists {
	select count(*) 
	from user_tab_columns
	where table_name = upper(:table_name)
	and column_name = upper(:column_name)
    }]
    return [expr $n_rows > 0]
}


ad_proc -public db_column_type { table_name column_name } {

    Returns the Oracle Data Type for the specified column.
    Returns -1 if the table or column doesn't exist.

    @author Yon Feldman (yon@arsdigita.com)

    @change-log 10 July, 2000: changed to return error
                               if column name doesn't exist  
                               (mdettinger@arsdigita.com)

    @change-log 11 July, 2000: changed to return lower case data types 
                               (yon@arsdigita.com)

    @change-log 11 July, 2000: changed to return error using the db_string default clause
                               (yon@arsdigita.com)

} {

    return [db_string column_type_select "
	select data_type as data_type
	  from user_tab_columns
	 where upper(table_name) = upper(:table_name)
	   and upper(column_name) = upper(:column_name)
    " -default "-1"]

}

ad_proc -public ad_column_type { table_name column_name } {

    Returns 'numeric' for number type columns, 'text' otherwise
    Throws an error if no such column exists.

    @author Yon Feldman (yon@arsdigita.com)

} {

    set column_type [db_column_type $table_name $column_name]

    if { $column_type == -1 } {
	return "Either table $table_name doesn't exist or column $column_name doesn't exist"
    } elseif { [string compare $column_type "NUMBER"] } {
	return "numeric"
    } else {
	return "text"
    }
}
