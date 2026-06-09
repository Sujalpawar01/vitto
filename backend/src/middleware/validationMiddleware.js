const ALLOWED_LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];
const ALLOWED_STATUSES = ['pending', 'approved', 'rejected'];

/**
 * Validate new loan application submission
 */
function validateApplicationSubmit(req, res, next) {
  const { name, mobile, amount, purpose, language } = req.body;
  const errors = [];

  // Validate Name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Applicant name is required and must be a non-empty string.');
  } else if (name.trim().length > 255) {
    errors.push('Applicant name must be less than 255 characters.');
  }

  // Validate Mobile (Indian mobile standard - 10 digits, or standard 10-12 digits)
  const mobileRegex = /^[6-9]\d{9}$/; // Starts with 6, 7, 8, or 9 and has 10 digits total
  if (!mobile || typeof mobile !== 'string') {
    errors.push('Mobile number is required.');
  } else if (!mobileRegex.test(mobile.trim())) {
    errors.push('Invalid mobile number. Please enter a valid 10-digit mobile number (e.g., 9876543210).');
  }

  // Validate Amount
  const numAmount = Number(amount);
  if (amount === undefined || amount === null || isNaN(numAmount)) {
    errors.push('Loan amount is required and must be a valid number.');
  } else if (numAmount <= 0) {
    errors.push('Loan amount must be a positive number greater than ₹0.');
  }

  // Validate Purpose
  if (!purpose || typeof purpose !== 'string' || purpose.trim().length === 0) {
    errors.push('Loan purpose is required.');
  }

  // Validate Language
  if (!language || typeof language !== 'string') {
    errors.push(`Preferred language is required. Choose from: ${ALLOWED_LANGUAGES.join(', ')}.`);
  } else {
    // Normalise language (e.g., camel case / capitalized)
    const normalizedLang = language.trim().charAt(0).toUpperCase() + language.trim().slice(1).toLowerCase();
    if (!ALLOWED_LANGUAGES.includes(normalizedLang)) {
      errors.push(`Invalid preferred language. Allowed options: ${ALLOWED_LANGUAGES.join(', ')}.`);
    } else {
      // Save normalized language back to body
      req.body.language = normalizedLang;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

/**
 * Validate application status transition
 */
function validateStatusUpdate(req, res, next) {
  const { status } = req.body;
  const errors = [];

  if (!status || typeof status !== 'string') {
    errors.push(`Status is required and must be one of: approved, rejected.`);
  } else {
    const cleanStatus = status.trim().toLowerCase();
    if (!ALLOWED_STATUSES.includes(cleanStatus)) {
      errors.push(`Invalid status. Allowed values: approved, rejected.`);
    } else if (cleanStatus === 'pending') {
      errors.push(`Status cannot be updated back to pending.`);
    } else {
      req.body.status = cleanStatus;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

/**
 * Validate Agent login input
 */
function validateLogin(req, res, next) {
  const { username, password } = req.body;
  const errors = [];

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    errors.push('Username is required.');
  }
  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

module.exports = {
  validateApplicationSubmit,
  validateStatusUpdate,
  validateLogin
};
