/**
 * Lightweight request validation middleware.
 *
 * Usage:
 *   const { validate, rules } = require('../middleware/validate');
 *   router.post('/login', validate(rules.login), loginController);
 *
 * Validation rules are plain objects:
 *   { field: { required, type, minLength, maxLength, match, enum, min, max } }
 */

/**
 * Validate a single value against a rule definition.
 * Returns an error string or null.
 */
function validateField(name, value, rule) {
  // Required check
  if (rule.required && (value === undefined || value === null || value === '')) {
    return `${name} is required`;
  }

  // If not present and not required, skip further checks
  if (value === undefined || value === null || value === '') return null;

  const str = String(value);

  if (rule.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(str)) return `${name} must be a valid email address`;
  }

  if (rule.type === 'number' && isNaN(Number(value))) {
    return `${name} must be a number`;
  }

  if (rule.minLength && str.length < rule.minLength) {
    return `${name} must be at least ${rule.minLength} characters`;
  }

  if (rule.maxLength && str.length > rule.maxLength) {
    return `${name} cannot exceed ${rule.maxLength} characters`;
  }

  if (rule.min !== undefined && Number(value) < rule.min) {
    return `${name} must be at least ${rule.min}`;
  }

  if (rule.max !== undefined && Number(value) > rule.max) {
    return `${name} cannot exceed ${rule.max}`;
  }

  if (rule.match && !rule.match.test(str)) {
    return rule.matchMessage || `${name} format is invalid`;
  }

  if (rule.enum && !rule.enum.includes(value)) {
    return `${name} must be one of: ${rule.enum.join(', ')}`;
  }

  return null;
}

/**
 * Returns an Express middleware that validates req.body against the schema.
 * On failure, responds 400 with { success: false, message, errors: [] }.
 */
const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, rule] of Object.entries(schema)) {
    const value = req.body[field];
    const err = validateField(field, value, rule);
    if (err) errors.push(err);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0], // first error as main message
      errors,
    });
  }

  next();
};

/** Pre-built rule sets for common endpoints */
const rules = {
  register: {
    firstName: { required: true, minLength: 1, maxLength: 50 },
    lastName:  { required: true, minLength: 1, maxLength: 50 },
    email:     { required: true, type: 'email' },
    password:  { required: true, minLength: 8, maxLength: 128 },
  },

  login: {
    email:    { required: true, type: 'email' },
    password: { required: true, minLength: 1 },
  },

  forgotPassword: {
    email: { required: true, type: 'email' },
  },

  resetPassword: {
    password: { required: true, minLength: 8, maxLength: 128 },
  },

  updatePassword: {
    currentPassword: { required: true, minLength: 1 },
    newPassword:     { required: true, minLength: 8, maxLength: 128 },
  },

  createProduct: {
    name:  { required: true, minLength: 1, maxLength: 150 },
    price: { required: true, type: 'number', min: 0 },
    sku:   { required: true, minLength: 1 },
  },

  createOrder: {
    items: { required: true },
  },
};

module.exports = { validate, rules };
