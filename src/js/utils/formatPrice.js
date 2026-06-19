const priceFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

export function formatPrice(price) {
  if (!Number.isFinite(price)) {
    return 'Brak ceny';
  }

  return priceFormatter.format(price);
}
