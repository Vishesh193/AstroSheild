/**
 * Utility functions for formatting data in a consistent way across the application
 */

/**
 * Formats a number with the specified options
 * 
 * @param {number} value - The number to format
 * @param {Object} options - Formatting options
 * @param {number} options.decimals - Number of decimal places (default: 2)
 * @param {boolean} options.compact - Whether to use compact notation (default: false)
 * @param {string} options.unit - Optional unit to append (e.g., 'km', '%')
 * @param {boolean} options.forceSign - Whether to always show the sign (default: false)
 * @returns {string} - The formatted number
 */
export const formatNumber = (value, options = {}) => {
  const { 
    decimals = 2, 
    compact = false, 
    unit = '', 
    forceSign = false 
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: 'short',
    signDisplay: forceSign ? 'always' : 'auto',
  });

  return `${formatter.format(value)}${unit ? ` ${unit}` : ''}`;
};

/**
 * Formats a date with the specified options
 * 
 * @param {Date|string|number} date - The date to format
 * @param {Object} options - Formatting options
 * @param {string} options.format - Format type: 'full', 'date', 'time', 'dateTime', 'relative' (default: 'full')
 * @param {boolean} options.includeTime - Whether to include the time (default: true)
 * @returns {string} - The formatted date
 */
export const formatDate = (date, options = {}) => {
  const { format = 'full', includeTime = true } = options;

  if (!date) {
    return 'N/A';
  }

  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    return 'Invalid Date';
  }

  if (format === 'relative') {
    return formatRelativeTime(dateObj);
  }

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: includeTime ? 'numeric' : undefined,
    minute: includeTime ? 'numeric' : undefined,
    second: format === 'full' && includeTime ? 'numeric' : undefined,
    hour12: true,
  });

  return dateFormatter.format(dateObj);
};

/**
 * Formats a date as a relative time (e.g., "2 hours ago")
 * 
 * @param {Date} date - The date to format
 * @returns {string} - The formatted relative time
 */
const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return diffInSeconds <= 5 ? 'just now' : `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Formats a file size in bytes to a human-readable format
 * 
 * @param {number} bytes - The file size in bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - The formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return 'N/A';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Formats a percentage value
 * 
 * @param {number} value - The value to format as a percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} - The formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  return formatNumber(value, { decimals, unit: '%' });
};

/**
 * Truncates text to a specified length and adds an ellipsis if needed
 * 
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation (default: 100)
 * @returns {string} - The truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format orbital altitude in kilometers
 * @param {number} altitude - Altitude in kilometers
 * @returns {string} Formatted altitude
 */
export const formatAltitude = (altitude) => {
  if (altitude === null || altitude === undefined || isNaN(altitude)) {
    return 'N/A';
  }
  
  return `${formatNumber(altitude, 1)} km`;
};

/**
 * Format orbital inclination in degrees
 * @param {number} inclination - Inclination in degrees
 * @returns {string} Formatted inclination
 */
export const formatInclination = (inclination) => {
  if (inclination === null || inclination === undefined || isNaN(inclination)) {
    return 'N/A';
  }
  
  return `${formatNumber(inclination, 2)}°`;
};

/**
 * Format RCS (Radar Cross Section) value
 * @param {number} rcs - RCS value in square meters
 * @returns {string} Formatted RCS
 */
export const formatRCS = (rcs) => {
  if (rcs === null || rcs === undefined || isNaN(rcs)) {
    return 'N/A';
  }
  
  return `${formatNumber(rcs, 2)} m²`;
};

/**
 * Format RCS size category in a human-readable format
 * @param {string|number} rcsSize - RCS size category or value
 * @returns {string} Formatted RCS size category
 */
export const formatRCSSize = (rcsSize) => {
  if (!rcsSize && rcsSize !== 0) {
    return 'Unknown';
  }
  
  // If it's a category string
  if (typeof rcsSize === 'string') {
    const categories = {
      'SMALL': 'Small (<0.1 m²)',
      'MEDIUM': 'Medium (0.1-1.0 m²)',
      'LARGE': 'Large (>1.0 m²)',
    };
    return categories[rcsSize] || rcsSize;
  }
  
  // If it's a numeric value
  const value = Number(rcsSize);
  if (isNaN(value)) {
    return 'Unknown';
  }
  
  if (value < 0.1) {
    return 'Small (<0.1 m²)';
  } else if (value <= 1.0) {
    return 'Medium (0.1-1.0 m²)';
  } else {
    return 'Large (>1.0 m²)';
  }
};

/**
 * Format orbital period in minutes
 * @param {number} period - Orbital period in minutes
 * @returns {string} Formatted period
 */
export const formatPeriod = (period) => {
  if (period === null || period === undefined || isNaN(period)) {
    return 'N/A';
  }
  
  // Convert to hours and minutes if greater than 60 minutes
  if (period > 60) {
    const hours = Math.floor(period / 60);
    const minutes = Math.round(period % 60);
    
    if (minutes === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}, ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }
  
  return `${formatNumber(period, 1)} minutes`;
};

/**
 * Get a human-readable label for debris size category
 * @param {string} sizeCategory - Size category code
 * @returns {string} Human-readable size category
 */
export const getDebrisSizeLabel = (sizeCategory) => {
  const categories = {
    'small': 'Small (<10 cm)',
    'medium': 'Medium (10-100 cm)',
    'large': 'Large (>100 cm)',
  };
  
  return categories[sizeCategory] || sizeCategory || 'Unknown';
};

/**
 * Get a human-readable label for orbit type
 * @param {string} orbitType - Orbit type code
 * @returns {string} Human-readable orbit type
 */
export const getOrbitTypeLabel = (orbitType) => {
  const orbitTypes = {
    'LEO': 'Low Earth Orbit',
    'MEO': 'Medium Earth Orbit',
    'GEO': 'Geostationary Orbit',
    'HEO': 'Highly Elliptical Orbit',
  };
  
  return orbitTypes[orbitType] || orbitType || 'Unknown';
};

export default {
  formatNumber,
  formatDate,
  formatFileSize,
  formatPercentage,
  truncateText,
  formatAltitude,
  formatInclination,
  formatRCS,
  formatRCSSize,
  formatPeriod,
  getDebrisSizeLabel,
  getOrbitTypeLabel,
}; 