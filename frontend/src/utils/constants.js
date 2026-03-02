export const APP_NAME = import.meta.env.VITE_APP_NAME || 'NextGen SaaS';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  VENDOR: 'vendor',
  VENDOR_STAFF: 'vendor_staff',
  CUSTOMER: 'customer',
};

export const ORDER_STATUS_COLORS = {
  pending: 'yellow',
  confirmed: 'blue',
  processing: 'indigo',
  shipped: 'purple',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'gray',
  returned: 'orange',
};

export const PRODUCT_STATUS_COLORS = {
  active: 'green',
  inactive: 'gray',
  draft: 'yellow',
  out_of_stock: 'red',
};