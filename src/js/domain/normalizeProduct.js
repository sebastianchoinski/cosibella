const DEFAULT_PRODUCT_NAME = 'Brak nazwy';
const DEFAULT_PRODUCT_CATEGORY = 'Brak kategorii';

export function normalizeProduct(product, index) {
  const sourceProduct = isPlainObject(product) ? product : {};

  return {
    id: normalizeId(sourceProduct, index),
    name: normalizeText(sourceProduct.name ?? sourceProduct.title, DEFAULT_PRODUCT_NAME),
    category: normalizeText(
      sourceProduct.category ?? sourceProduct.category_name,
      DEFAULT_PRODUCT_CATEGORY,
    ),
    price: normalizePrice(sourceProduct.price),
    // keep the source item for the details modal
    raw: product,
  };
}

function normalizeId(product, index) {
  const id = product.id ?? product.product_id;

  if (id === null || id === undefined || String(id).trim() === '') {
    return `product-${index + 1}`;
  }

  return String(id);
}

function normalizeText(value, fallback) {
  if (value === null || value === undefined) {
    return fallback;
  }

  const text = String(value).trim();
  return text || fallback;
}

function normalizePrice(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value
    .trim()
    .replace(/\s/g, '')
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.');

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
