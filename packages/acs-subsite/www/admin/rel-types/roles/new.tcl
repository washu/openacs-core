# /packages/mbryzek-subsite/www/admin/rel-types/role-new.tcl

ad_page_contract {

    Form to create a new role

    @author mbryzek@arsdigita.com
    @creation-date Mon Dec 11 10:52:35 2000
    @cvs-id $Id$

} {
    { role:trim "" }
    { pretty_name "" }
    { pretty_plural "" }
    { return_url "" }
} -properties {
    context_bar:onevalue
    
}

set context_bar [list [list "../" "Relationship types"] [list "[ad_conn package_url]admin/rel-types/roles/" "Roles"] "Create role"]

template::form create role_form

template::element create role_form return_url \
	-optional \
	-value $return_url \
	-datatype text \
	-widget hidden

template::element create role_form role \
	-label "Role" \
	-datatype text \
	-html {maxlength 100}

template::element create role_form pretty_name \
	-label "Pretty name" \
	-datatype text \
	-html {maxlength 100}

template::element create role_form pretty_plural \
	-label "Pretty plural" \
	-datatype text \
	-html {maxlength 100}

if { [template::form is_valid role_form] } {
    if { [db_string role_exists_p {
	select count(r.role) from acs_rel_roles r where r.role = :role
    }] } {
	ad_return_complaint 1 "<li> The role you entered \"$role\" already exists."
	return
    }

    db_transaction {
	db_exec_plsql create_role {
	    begin acs_rel_type.create_role(role => :role, pretty_name => :pretty_name, pretty_plural => :pretty_plural); end;
	}
    }
    ad_returnredirect $return_url
    return
}


ad_return_template
