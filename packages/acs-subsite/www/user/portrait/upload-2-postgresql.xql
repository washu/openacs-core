<?xml version="1.0"?>
<queryset>
   <rdbms><type>postgresql</type><version>7.1</version></rdbms>

<fullquery name="create_item">
        <querytext>

  select content_item__new(
         :name,
         null,
         null,
         null,
         now(),
         null,
         null,
         :creation_ip,
         'content_item',
         'content_revision',
         null,
         null,
         'text/plain',
         null,
         null,
         'file'
         )


        </querytext>
</fullquery>

<fullquery name="create_rel">
        <querytext>

        select acs_rel__new (
         null,
         'user_portrait_rel',
         :user_id,
         :item_id,
         null,
         null,
         null
        )


        </querytext>
</fullquery>

<fullquery name="create_revision">
        <querytext>

  declare
        v_revision_id      integer;
  begin

  v_revision_id := content_revision__new(
                                       :title,
                                       :portrait_comment,
                                       now(),
                                       :guessed_file_type,
                                       null,
                                       'not_important',
                                       :item_id,
                                       null,
                                       now(),
                                       :user_id,
                                       :creation_ip
                                       );

  update cr_items
  set live_revision = v_revision_id
  where item_id = :item_id;

  return v_revision_id;

  end;

        </querytext>
</fullquery>

<fullquery name="update_photo">
        <querytext>

        update cr_revisions
        set content = '[cr_create_content_file $item_id $revision_id $tmp_filename]'
        where revision_id = :revision_id

        </querytext>
</fullquery>

<fullquery name="update_photo_info">
        <querytext>

	update cr_revisions
	set description = :portrait_comment,
	    publish_date = now(),
	    mime_type = :guessed_file_type,
	    title = :title
	where revision_id = :revision_id
 
        </querytext>
</fullquery>

</queryset>
