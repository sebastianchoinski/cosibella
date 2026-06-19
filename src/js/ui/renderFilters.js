import { DEFAULT_PAGE_SIZE, PAGE_SIZES, SORT_OPTIONS } from '../domain/selectors.js';
import { debounce } from '../utils/debounce.js';
import { escapeHtml } from '../utils/escapeHtml.js';

const PRICE_INPUT_DEBOUNCE_MS = 300;
const OPTIONS_KEY_SEPARATOR = '\u001f';

const elements = {
  categoryFilter: document.querySelector('#category-filter'),
  minPriceFilter: document.querySelector('#min-price-filter'),
  maxPriceFilter: document.querySelector('#max-price-filter'),
  sortFilter: document.querySelector('#sort-filter'),
  pageSizeFilter: document.querySelector('#page-size-filter'),
  clearFiltersButton: document.querySelector('#clear-filters-button'),
  resultsSummary: document.querySelector('#results-summary'),
};

let previousCategoryOptionsKey = '';

export function setupFilters({ onFilterChange, onClearFilters }) {
  elements.categoryFilter.addEventListener('change', handleCategoryChange);
  elements.minPriceFilter.addEventListener('input', handleMinPriceInput);
  elements.maxPriceFilter.addEventListener('input', handleMaxPriceInput);
  elements.sortFilter.addEventListener('change', handleSortChange);
  elements.pageSizeFilter.addEventListener('change', handlePageSizeChange);
  elements.clearFiltersButton.addEventListener('click', onClearFilters);

  function handleCategoryChange(event) {
    onFilterChange({ category: event.target.value });
  }

  const handleDebouncedMinPriceChange = debounce((value) => {
    onFilterChange({ minPrice: value });
  }, PRICE_INPUT_DEBOUNCE_MS);

  const handleDebouncedMaxPriceChange = debounce((value) => {
    onFilterChange({ maxPrice: value });
  }, PRICE_INPUT_DEBOUNCE_MS);

  function handleMinPriceInput(event) {
    handleDebouncedMinPriceChange(event.target.value.trim());
  }

  function handleMaxPriceInput(event) {
    handleDebouncedMaxPriceChange(event.target.value.trim());
  }

  function handleSortChange(event) {
    onFilterChange({ sortBy: event.target.value });
  }

  function handlePageSizeChange(event) {
    onFilterChange({ pageSize: Number(event.target.value) });
  }
}

export function renderFilters({ state, categories, viewModel }) {
  renderCategoryOptions(categories, state.category);
  renderSortOptions(state.sortBy);
  renderPageSizeOptions(state.pageSize);
  setControlValue(elements.minPriceFilter, state.minPrice);
  setControlValue(elements.maxPriceFilter, state.maxPrice);
  setControlsDisabled(state.status === 'loading');
  renderResultsSummary(state, viewModel);
}

function renderCategoryOptions(categories, selectedCategory) {
  const hasSelectedCategory = !selectedCategory || categories.includes(selectedCategory);
  // keep url category visible untill products load
  const visibleCategories = hasSelectedCategory ? categories : [selectedCategory, ...categories];
  const nextCategoryOptionsKey = visibleCategories.join(OPTIONS_KEY_SEPARATOR);

  if (nextCategoryOptionsKey !== previousCategoryOptionsKey) {
    const options = [
      '<option value="">Wszystkie kategorie</option>',
      ...visibleCategories.map((category) => {
        const escapedCategory = escapeHtml(category);
        return `<option value="${escapedCategory}">${escapedCategory}</option>`;
      }),
    ];

    elements.categoryFilter.innerHTML = options.join('');
    previousCategoryOptionsKey = nextCategoryOptionsKey;
  }

  elements.categoryFilter.value = selectedCategory;
}

function renderSortOptions(selectedSortBy) {
  elements.sortFilter.value = SORT_OPTIONS.includes(selectedSortBy) ? selectedSortBy : 'default';
}

function renderPageSizeOptions(selectedPageSize) {
  elements.pageSizeFilter.value = PAGE_SIZES.includes(selectedPageSize)
    ? String(selectedPageSize)
    : String(DEFAULT_PAGE_SIZE);
}

function setControlValue(control, value) {
  if (document.activeElement === control) {
    return;
  }

  control.value = value;
}

function setControlsDisabled(isDisabled) {
  [
    elements.categoryFilter,
    elements.minPriceFilter,
    elements.maxPriceFilter,
    elements.sortFilter,
    elements.pageSizeFilter,
  ].forEach((control) => {
    control.disabled = isDisabled;
  });
}

function renderResultsSummary(state, viewModel) {
  if (state.status === 'loading') {
    elements.resultsSummary.textContent = 'Pobieranie produktów...';
    return;
  }

  if (state.status === 'error') {
    elements.resultsSummary.textContent = 'Nie udało się pobrać listy produktów.';
    return;
  }

  if (viewModel.isPriceRangeInvalid) {
    elements.resultsSummary.textContent = 'Popraw zakres cen, aby zobaczyć wyniki.';
    return;
  }

  if (viewModel.totalResults === 0) {
    elements.resultsSummary.textContent = 'Brak wyników dla aktualnych kryteriów.';
    return;
  }

  elements.resultsSummary.textContent = `Znaleziono: ${viewModel.totalResults}. Strona ${viewModel.currentPage} z ${viewModel.totalPages}.`;
}
