import { escapeHtml } from '../utils/escapeHtml.js';

const statusRegion = document.querySelector('#app-status');

export function setupStateActions({ onRetry, onClearFilters }) {
  statusRegion.addEventListener('click', (event) => {
    // state cards are swapped with innerhtml
    const actionButton = event.target.closest('[data-state-action]');

    if (!actionButton) {
      return;
    }

    if (actionButton.dataset.stateAction === 'retry') {
      onRetry();
      return;
    }

    if (actionButton.dataset.stateAction === 'clear-filters') {
      onClearFilters();
    }
  });
}

export function renderStates({ state, viewModel }) {
  if (state.status === 'loading') {
    statusRegion.innerHTML = `
      <div class="state-card state-card--loading">
        <h2 class="state-card__title">Pobieranie produktów</h2>
        <p class="state-card__description">Przygotowujemy listę produktów.</p>
      </div>
    `;
    return;
  }

  if (state.status === 'error') {
    const escapedError = state.error ? escapeHtml(state.error) : '';
    // api errors are shown only as short details
    const detailsTemplate = escapedError
      ? `<p class="state-card__details">Szczegóły: ${escapedError}</p>`
      : '';

    statusRegion.innerHTML = `
      <div class="state-card state-card--error">
        <h2 class="state-card__title">Nie udało się pobrać produktów</h2>
        <p class="state-card__description">Nie udało się pobrać produktów. Sprawdź połączenie internetowe lub spróbuj ponownie.</p>
        ${detailsTemplate}
        <button class="button" type="button" data-state-action="retry">Spróbuj ponownie</button>
      </div>
    `;
    return;
  }

  if (viewModel.isPriceRangeInvalid) {
    statusRegion.innerHTML = `
      <div class="state-card state-card--invalid">
        <h2 class="state-card__title">Niepoprawny zakres ceny</h2>
        <p class="state-card__description">Minimalna cena nie może być większa niż maksymalna.</p>
      </div>
    `;
    return;
  }

  if (state.status === 'success' && viewModel.totalResults === 0) {
    statusRegion.innerHTML = `
      <div class="state-card state-card--empty">
        <h2 class="state-card__title">Brak wyników</h2>
        <p class="state-card__description">Brak produktów spełniających wybrane kryteria.</p>
        <button class="button" type="button" data-state-action="clear-filters">Wyczyść filtry</button>
      </div>
    `;
    return;
  }

  statusRegion.innerHTML = '';
}
