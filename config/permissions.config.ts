const PERMISSIONS = {
  admin: [
    'list_contents', 'manage_users', 'view_users', 'delete_user',
    'view_writers', 'list_readers', 'create_content', 'view_contents',
    'update_product', 'delete_product', 'delete_writer', 'delete_reader',
    'update_writer', 'delete_account', 'view_readers', 'view_reader',
    'show_Content', 'view_self', 'update_self', 'view-self'
  ],
  writer: [
    'list_readers', 'create_content', 'view_contents', 'update_content',
    'delete_content', 'delete_writer', 'update_writer', 'show_Content',
    'view-self', 'view_writer', 'list_contents', 'view_readers', 'view_writers'
  ],
  reader: [
    'list_contents', 'list_readers', 'view_contents', 'create_content',
    'update_content', 'delete_account', 'delete_reader', 'view_reader',
    'show_Content', 'view_writers', 'update_reader'
  ]
};

export default PERMISSIONS;