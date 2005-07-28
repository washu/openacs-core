ad_page_contract {
    Display a given service contract

    @author Jeff Davis <davis@xarg.net>
    @creation-date 2005-02-05
    @cvs-id $Id$
} {
    id
    impl_name:trim,notnull
}

set contract_name [db_string contract_name {select contract_name from acs_sc_contracts where contract_id = :id}]

db_multirow contract contract {
  select o.contract_name, o.operation_name, o.operation_desc, (case when t.msg_type_id = o.operation_inputtype_id then 'input' else 'output' end) as inout,
        e.element_name as param, e.element_msg_type_isset_p as set_p, et.msg_type_name as param_type
  from acs_sc_operations o,
       acs_sc_msg_types t,
       acs_sc_msg_type_elements e,
       acs_sc_msg_types et
  where contract_id = :id
    and t.msg_type_id in (o.operation_inputtype_id, operation_outputtype_id)
    and e.msg_type_id = t.msg_type_id
    and et.msg_type_id = e.element_msg_type_id
    order by o.contract_name, o.operation_name, t.msg_type_name, e.element_pos }


template::list::create \
    -name binding \
    -multirow binding \
    -elements {
        impl_operation_name {
            label "Operation"
        }
        impl_pl {
            label "Language"
        }
        impl_alias {
            label "Alias"
            display_template {@binding.impl_alias;noquote@}
        }
    }

db_multirow -extend {check} binding binding {
    select impl_operation_name, impl_alias, impl_pl 
    from acs_sc_impl_aliases 
    where impl_name = :impl_name and impl_contract_name = :contract_name
    order by lower(impl_operation_name)
    
} {
    if {[string equal $impl_pl "TCL"]} {
        regsub {^::} $impl_alias {} impl_alias
        if {[empty_string_p [info proc ::$impl_alias]]} {
            append impl_alias {</b> - <b style="color: red">NOT FOUND!</b>}
        } else {
            append impl_alias "</b> {[info args ::$impl_alias]}"
        }
        set impl_alias "<b>$impl_alias"
    }
}