// Formater le prix en FCFA
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-SN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA';
}

// Devise
export const CURRENCY = 'FCFA';
export const CURRENCY_SYMBOL = 'FCFA';
