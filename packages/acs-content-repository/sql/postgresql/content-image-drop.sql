-- drop the content-image type from the data model

-- Copyright (C) 20000 ArsDigita Corporation

-- $Id$

-- This is free software distributed under the terms of the GNU Public
-- License.  Full text of the license is available from the GNU Project:
-- http://www.fsf.org/copyleft/gpl.html

-- unregister mime types from the image type
begin;

  select content_type__unregister_mime_type(
    'image',
    'image/jpeg'
  );

  select content_type__unregister_mime_type(
    'image',
    'image/gif'
  );

end;

-- remove image mime types

delete from cr_mime_types where mime_type like 'image%';



-- this should remove the attributes and table related to the 
-- the image type

begin;

  select content_type__drop_type (
    'image',
    'f',
    't');

end;



