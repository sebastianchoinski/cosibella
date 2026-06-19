import { escapeHtml } from '../utils/escapeHtml.js';
import { formatPrice } from '../utils/formatPrice.js';

const SKELETON_CARD_COUNT = 8;

const productsGrid = document.querySelector('#products-grid');

export function setupProductsGrid({ onProductSelect }) {
  productsGrid.addEventListener('click', (event) => {
    // cards are rerendered often, so one listener is enough
    const productButton = event.target.closest('[data-product-id]');

    if (!productButton) {
      return;
    }

    onProductSelect(productButton.dataset.productId, productButton);
  });
}

export function renderProducts({ state, visibleProducts, isPriceRangeInvalid }) {
  productsGrid.setAttribute('aria-busy', String(state.status === 'loading'));

  if (state.status === 'loading') {
    productsGrid.innerHTML = createSkeletonCardsTemplate();
    return;
  }

  if (state.status !== 'success' || isPriceRangeInvalid || visibleProducts.length === 0) {
    // message for these cases is rendered in status region
    productsGrid.innerHTML = '';
    return;
  }

  productsGrid.innerHTML = visibleProducts.map(createProductCardTemplate).join('');
}

function createProductCardTemplate(product) {
  const escapedId = escapeHtml(product.id);
  const escapedName = escapeHtml(product.name);
  const escapedCategory = escapeHtml(product.category);
  const escapedPrice = escapeHtml(formatPrice(product.price));

  return `
    <button class="product-card" type="button" data-product-id="${escapedId}" aria-label="Otwórz szczegóły produktu ${escapedName}">
      <span class="product-card__id">ID: ${escapedId}</span>
      <span class="product-card__title">${escapedName}</span>
      <span class="product-card__meta">
        <span>Kategoria</span>
        <strong>${escapedCategory}</strong>
      </span>
      <span class="product-card__meta">
        <span>Cena</span>
        <strong>${escapedPrice}</strong>
      </span>
      <span class="product-card__action">Otwórz szczegóły</span>
    </button>
  `;
}

function createSkeletonCardsTemplate() {
  return Array.from({ length: SKELETON_CARD_COUNT }, () => {
    return `
      <article class="product-card product-card--skeleton" aria-hidden="true">
        <span class="skeleton skeleton--small"></span>
        <span class="skeleton skeleton--title"></span>
        <span class="skeleton skeleton--line"></span>
        <span class="skeleton skeleton--line"></span>
      </article>
    `;
  }).join('');
}
