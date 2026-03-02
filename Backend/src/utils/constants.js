module.exports = {
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    VENDOR: 'vendor',
    VENDOR_STAFF: 'vendor_staff',
    CUSTOMER: 'customer',
  },

  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  },

  PAYMENT_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },

  PAYMENT_METHODS: {
    STRIPE: 'stripe',
    RAZORPAY: 'razorpay',
    PAYPAL: 'paypal',
    UPI: 'upi',
    COD: 'cod',
  },

  SUBSCRIPTION_PLANS: {
    FREE: 'free',
    STARTER: 'starter',
    PROFESSIONAL: 'professional',
    ENTERPRISE: 'enterprise',
  },

  CATALOG_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
  },

  PRODUCT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    OUT_OF_STOCK: 'out_of_stock',
  },
};