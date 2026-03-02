export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
  return /^[+]?[\d\s-]{10,15}$/.test(phone);
};

export const isValidPassword = (password) => {
  return password && password.length >= 8;
};