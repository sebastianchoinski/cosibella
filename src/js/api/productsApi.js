const API_URL = 'https://s5.cosibella.pl/api/test/products';
const REQUEST_TIMEOUT_MS = 10000;

export class ProductsApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProductsApiError';
  }
}

export async function fetchProducts() {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ProductsApiError(`API zwróciło status ${response.status}.`);
    }

    const payload = await response.json();

    if (Array.isArray(payload)) {
      return payload;
    }

    throw new ProductsApiError('Odpowiedź API ma nieobsługiwany format.');
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ProductsApiError('Przekroczono czas oczekiwania na odpowiedź API.');
    }

    if (error instanceof ProductsApiError) {
      throw error;
    }

    throw new ProductsApiError('Wystąpił błąd sieci podczas pobierania produktów.');
  } finally {
    window.clearTimeout(timeoutId);
  }
}
