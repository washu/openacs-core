ad_page_contract {

    Request a new notification - Ask for more stuff

    @author Ben Adida (ben@openforce.net)
    @creation-date 2002-05-24
    @cvs-id $Id$
} {
    type_id:integer,notnull
    object_id:integer,notnull
    {pretty_name ""}
    return_url
}

set user_id [ad_maybe_redirect_for_registration]

# Check that the object can be subcribed to
notification::security::require_notify_object -object_id $object_id

if {[empty_string_p $pretty_name]} { 
    set page_title "[_ notifications.Request_Notification]"
} else { 
    set page_title "[_ notifications.lt_Request_Notification_]"
}

set context [list "[_ notifications.Request_Notification]"]

set intervals [notification::get_intervals -type_id $type_id]
set delivery_methods [notification::get_delivery_methods -type_id $type_id]

ad_form -name subscribe -export {type_id object_id return_url} -form {
    {interval_id:integer(select)           {label "[_ notifications.lt_Notification_Interval]"}
                                           {options $intervals}}
    {delivery_method_id:integer(select)    {label "[_ notifications.Delivery_Method]"}
                                           {options $delivery_methods}}
} -on_submit {

    # Add the subscribe
    notification::request::new \
            -type_id $type_id \
            -user_id $user_id \
            -object_id $object_id \
            -interval_id $interval_id \
            -delivery_method_id $delivery_method_id

    ad_returnredirect $return_url
    ad_script_abort
}

ad_return_template
