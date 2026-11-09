/**
 * Malaysian Currency & Monetary Utilities
 * NexusBMS Malaysian Localization Standard
 */

/**
 * Format a number as Ringgit Malaysia (e.g. RM 1,250.00)
 */
export const formatRM = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `RM ${num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Alias for general currency formatting default to RM
 */
export const formatCurrency = (amount, currency = 'RM') => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `${currency} ${num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Bank Negara Malaysia (BNM) Mandatory 5-Sen Cash Rounding Mechanism
 * Applies to total bill when paid in cash in Malaysia:
 * - 1, 2 sen: round down to 0
 * - 3, 4 sen: round up to 5
 * - 6, 7 sen: round down to 5
 * - 8, 9 sen: round up to 10
 */
export const roundTo5Sen = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const sen = Math.round(num * 100);
  const lastDigit = sen % 10;
  
  let roundedDigit = 0;
  if (lastDigit === 1 || lastDigit === 2) {
    roundedDigit = 0;
  } else if (lastDigit >= 3 && lastDigit <= 7) {
    roundedDigit = 5;
  } else if (lastDigit === 8 || lastDigit === 9) {
    roundedDigit = 10;
  }
  
  const roundedSen = Math.floor(sen / 10) * 10 + roundedDigit;
  const roundedTotal = roundedSen / 100;
  const roundingAdjustment = parseFloat((roundedTotal - num).toFixed(2));

  return {
    roundedTotal,
    roundingAdjustment
  };
};
