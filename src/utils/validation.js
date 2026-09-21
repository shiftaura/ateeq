// Validation utility functions
export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!email) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = ({ name, email, password, confirmPassword, dateOfBirth, gender, agreeTerms }) => {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Please provide your full legal name';
  }

  if (!email) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  const pwdErr = validatePassword(password);
  if (pwdErr) {
    errors.password = pwdErr;
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  }

  if (!gender) {
    errors.gender = 'Please select your gender';
  }

  if (!agreeTerms) {
    errors.agreeTerms = 'You must agree to the Terms and Privacy Policy';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
