const PERMISSIONS: Record<string, string[]> = {
  admin: [
    'list_farmers',   'list_grocers',   'list_buyers',
    'view_farmer',    'view_grocer',    'view_buyer',
    'delete_farmer',  'delete_grocer',  'delete_buyer',
    'update_farmer',  'update_grocer',  'update_buyer',
    'view_farmers',   'view_grocers',   'view_buyers',
    'view_produce',   'create_produce', 'update_produce', 'delete_produce',
    'view_self',      'update_self',    'delete_account',
    'manage_users',
  ],
  farmer: [
    'view_self',      'update_self',    'update_farmer',
    'create_produce', 'update_produce', 'delete_produce',
    'view_produce',   'view_farmers',   'view_grocers',
    'list_grocers',
  ],
  grocer: [
    'view_self',      'update_self',    'update_grocer',
    'list_grocers',   'view_grocers',   'view_farmers',
    'list_farmers',   'view_produce',
  ],
  buyer: [
    'view_self',      'update_self',    'update_buyer',
    'view_produce',   'view_farmers',   'list_farmers',
    'view_grocers',   'list_grocers',
  ],
};

export default PERMISSIONS;