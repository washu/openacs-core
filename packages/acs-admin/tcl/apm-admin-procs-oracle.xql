<?xml version="1.0"?>

<queryset>
   <rdbms><type>oracle</type><version>8.1.6</version></rdbms>

<fullquery name="apm_higher_version_installed_p.apm_higher_version_installed_p">      
      <querytext>
      
		declare 
		v_version_name varchar(4000); 
		begin
		select version_name into v_version_name
		from apm_package_versions where
		version_id = apm_package.highest_version(:package_key);
		:1 := apm_package_version.version_name_greater(:version_name, v_version_name);
		end;
    
      </querytext>
</fullquery>

 
</queryset>
