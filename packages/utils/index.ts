// Utility helpers for the Monotickets platform.

/**
 * Format a number as a currency string in Mexican Pesos.  Uses
 * Intl.NumberFormat under the hood.  Pass in the amount as a number and
 * optionally override the locale or currency.
 */
export function formatCurrency(
  amount: number,
  locale: string = 'es-MX',
  currency: string = 'MXN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Sleep helper for asynchronous workflows.  Returns a promise that resolves
 * after the specified number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
