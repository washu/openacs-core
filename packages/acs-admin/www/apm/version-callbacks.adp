<master>
<property name="doc(title)">@page_title;noquote@</property>
<property name="context">@context;noquote@</property>


<p><listtemplate name="callbacks"></listtemplate></p>

<h3>Help</h3>

<p>
  Below is the list of available callbacks and the parameters they will be called with. Note that the parameters are sent as named parameters.
</p>

<p>
  For install, uninstall, and upgrade, the before/after part of the
  name refers to before or after the database create/upgrade/drop
  scripts have been run. For mounting and instantiating, well, that should be fairly obvious.
</p>

<p>
  For the upgrade callbacks, you should definitely check out the proc <a
  href="/api-doc/proc-view?proc=apm%5fupgrade%5flogic">apm_upgrade_logic</a>,
  which makes it very easy to handle the logic of which things to
  process depending on which version you're upgrading from and to.
</p>

<table cellspacing="1" cellpadding="4" bgcolor="#999999">
  <tr bgcolor="white">
    <th>Callback</th>
    <th>Parameters</th>
  </tr>

  <tr bgcolor="white">
    <td>
      before-install
    </td>
    <td>
      
    </td>
  </tr>

  <tr bgcolor="white">
    <td>
      after-install
    </td>
    <td>
      
    </td>
  </tr>

  <tr bgcolor="white">
    <td>
      before-upgrade
    </td>
    <td>
      -from_version_name
      -to_version_name
    </td>
  </tr>

  <tr bgcolor="white">
    <td>
      after-upgrade
    </td>
    <td>
      -from_version_name
      -to_version_name
    </td>
  </tr>

  <tr bgcolor="white">
    <td>
      before-uninstall
    </td>
    <td>
      
    </td>
  </tr>

  <tr bgcolor="white">
    <td>
      after-instantiate
    </td>
    <td>
      -package_id      
    </td>
  </tr>

  <tr bgcolor="white">
    <td>
      before-uninstantiate
    </td>
    <td>
      -package_id
    </td>
  </tr>

  <tr bgcolor="white">
    <td>
      after-mount
    </td>
    <td>
      -package_id
      -node_id
    </td>
  </tr>

  <tr bgcolor="white">
    <td>
      before-unmount
    </td>
    <td>
      -package_id 
      -node_id
    </td>
  </tr>

</table>
