import { escapeHtml } from '../utils/escapeHtml.js';
import { formatPrice } from '../utils/formatPrice.js';

const modal = document.querySelector('#product-modal');
const modalPanel = modal.querySelector('.modal__panel');
const modalBody = document.querySelector('#modal-body');
const modalTitle = document.querySelector('#modal-title');
const closeButton = document.querySelector('#modal-close-button');

let previouslyFocusedElement = null;

export function setupModal() {
  closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target.matches('[data-modal-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', handleDocumentKeydown);

  return {
    openModal,
    closeModal,
  };
}

function openModal(product, openerElement) {
  previouslyFocusedElement = openerElement || document.activeElement;
  modalTitle.textContent = product.name;
  modalBody.innerHTML = createProductDetailsTemplate(product);

  const jsonContainer = modalBody.querySelector('#product-json');
  jsonContainer.textContent = stringifyRawProduct(product.raw);

  modal.hidden = false;
  lockBodyScroll();
  modalPanel.scrollTop = 0;
  closeButton.focus();
}

function closeModal() {
  if (modal.hidden) {
    return;
  }

  modal.hidden = true;
  modalBody.innerHTML = '';
  unlockBodyScroll();

  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
    previouslyFocusedElement.focus();
  }

  previouslyFocusedElement = null;
}

function handleDocumentKeydown(event) {
  if (modal.hidden) {
    return;
  }

  if (event.key === 'Escape') {
    closeModal();
  }
}

function createProductDetailsTemplate(product) {
  const escapedId = escapeHtml(product.id);
  const escapedName = escapeHtml(product.name);
  const escapedCategory = escapeHtml(product.category);
  const escapedPrice = escapeHtml(formatPrice(product.price));

  return `
    <dl class="modal__summary">
      <div class="modal__summary-row">
        <dt>ID</dt>
        <dd>${escapedId}</dd>
      </div>
      <div class="modal__summary-row">
        <dt>Nazwa</dt>
        <dd>${escapedName}</dd>
      </div>
      <div class="modal__summary-row">
        <dt>Kategoria</dt>
        <dd>${escapedCategory}</dd>
      </div>
      <div class="modal__summary-row">
        <dt>Cena</dt>
        <dd>${escapedPrice}</dd>
      </div>
    </dl>

    <section class="modal__raw" aria-labelledby="modal-json-title">
      <h3 class="modal__subtitle" id="modal-json-title">Pełne dane produktu</h3>
      <pre class="modal__json" id="product-json"></pre>
    </section>
  `;
}

function stringifyRawProduct(rawProduct) {
  const json = JSON.stringify(rawProduct, null, 2);
  return json || 'Brak danych źródłowych.';
}

function lockBodyScroll() {
  document.body.classList.add('is-modal-open');
}

function unlockBodyScroll() {
  document.body.classList.remove('is-modal-open');
}
