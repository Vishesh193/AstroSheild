/**
 * Validates an email address
 * 
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a required field
 * 
 * @param {any} value - The value to validate
 * @returns {boolean} - Whether the value is not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  return true;
};

/**
 * Validates a number within a range
 * 
 * @param {number} value - The value to validate
 * @param {number} min - The minimum allowed value
 * @param {number} max - The maximum allowed value
 * @returns {boolean} - Whether the value is within the range
 */
export const isInRange = (value, min, max) => {
  if (value === null || value === undefined || isNaN(value)) return false;
  
  const numValue = Number(value);
  return numValue >= min && numValue <= max;
};

/**
 * Validates a URL
 * 
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates a password strength
 * 
 * @param {string} password - The password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum password length (default: 8)
 * @param {boolean} options.requireUppercase - Whether to require uppercase letters (default: true)
 * @param {boolean} options.requireLowercase - Whether to require lowercase letters (default: true)
 * @param {boolean} options.requireNumbers - Whether to require numbers (default: true)
 * @param {boolean} options.requireSpecialChars - Whether to require special characters (default: true)
 * @returns {boolean} - Whether the password meets the requirements
 */
export const isStrongPassword = (password, options = {}) => {
  const { 
    minLength = 8, 
    requireUppercase = true, 
    requireLowercase = true, 
    requireNumbers = true, 
    requireSpecialChars = true 
  } = options;
  
  if (!password || password.length < minLength) return false;
  
  // Check for uppercase letters
  if (requireUppercase && !/[A-Z]/.test(password)) return false;
  
  // Check for lowercase letters
  if (requireLowercase && !/[a-z]/.test(password)) return false;
  
  // Check for numbers
  if (requireNumbers && !/[0-9]/.test(password)) return false;
  
  // Check for special characters
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;
  
  return true;
};

/**
 * Validates a date
 * 
 * @param {Date|string} date - The date to validate
 * @param {Object} options - Validation options
 * @param {Date|string} options.minDate - Minimum allowed date
 * @param {Date|string} options.maxDate - Maximum allowed date
 * @returns {boolean} - Whether the date is valid and within the range
 */
export const isValidDate = (date, options = {}) => {
  const { minDate, maxDate } = options;
  
  if (!date) return false;
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) return false;
  
  if (minDate) {
    const minDateObj = minDate instanceof Date ? minDate : new Date(minDate);
    if (dateObj < minDateObj) return false;
  }
  
  if (maxDate) {
    const maxDateObj = maxDate instanceof Date ? maxDate : new Date(maxDate);
    if (dateObj > maxDateObj) return false;
  }
  
  return true;
};

/**
 * Validates a phone number
 * 
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check if the number has a reasonable length (7-15 digits)
  return digits.length >= 7 && digits.length <= 15;
};

/**
 * Validates a file size
 * 
 * @param {number} size - The file size in bytes
 * @param {number} maxSize - The maximum allowed size in bytes
 * @returns {boolean} - Whether the file size is valid
 */
export const isValidFileSize = (size, maxSize) => {
  if (size === null || size === undefined || isNaN(size)) return false;
  
  return size > 0 && size <= maxSize;
};

/**
 * Validates a file type
 * 
 * @param {string} filename - The filename to validate
 * @param {Array<string>} allowedExtensions - Array of allowed file extensions (e.g., ['.jpg', '.png'])
 * @returns {boolean} - Whether the file type is allowed
 */
export const isValidFileType = (filename, allowedExtensions) => {
  if (!filename || !allowedExtensions || !Array.isArray(allowedExtensions)) return false;
  
  const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return allowedExtensions.includes(extension);
};

export default {
  isValidEmail,
  isRequired,
  isInRange,
  isValidUrl,
  isStrongPassword,
  isValidDate,
  isValidPhone,
  isValidFileSize,
  isValidFileType,
}; 