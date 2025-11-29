/**
 * Currency formatting utility for Kenyan Shillings (KES)
 */

/**
 * Format amount as Kenyan Shillings
 * @param {number|string} amount - The amount to format
 * @param {object} options - Formatting options
 * @param {boolean} options.showSymbol - Whether to show currency symbol (default: true)
 * @param {boolean} options.showDecimals - Whether to show decimals (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const { showSymbol = true, showDecimals = true } = options;
  const numAmount = parseFloat(amount || 0);
  const absAmount = Math.abs(numAmount);
  
  let formatted;
  if (showDecimals) {
    formatted = absAmount.toFixed(2);
  } else {
    formatted = Math.round(absAmount).toString();
  }
  
  // Add thousand separators
  formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  if (showSymbol) {
    return `KSh ${formatted}`;
  }
  return formatted;
};

/**
 * Format price per day
 * @param {number|string} amount - The daily rate
 * @returns {string} Formatted price string (e.g., "KSh 1,500/day")
 */
export const formatPricePerDay = (amount) => {
  const numAmount = parseFloat(amount || 0);
  const formatted = Math.round(numAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `KSh ${formatted}/day`;
};

/**
 * Parse currency string to number (removes KSh, commas, etc.)
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  // Remove KSh, $, commas, spaces, and other non-numeric characters except decimal point
  const cleaned = currencyString.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
};

