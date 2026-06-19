import '../scss/main.scss';

import { fetchProducts } from './api/productsApi.js';
import { normalizeProduct } from './domain/normalizeProduct.js';
import { selectProductsViewModel } from './domain/selectors.js';
import { getState, setState, subscribe } from './state/store.js';
import { readStateFromUrl, syncStateToUrl } from './state/urlState.js';
import { renderFilters, setupFilters } from './ui/renderFilters.js';
import { renderProducts, setupProductsGrid } from './ui/renderProducts.js';

setupFilters({
  onFilterChange: handleFilterChange,
  onClearFilters: handleClearFilters,
});

setupProductsGrid({
  onProductSelect: () => {},
});

window.addEventListener('popstate', handlePopState);

setState(readStateFromUrl());
subscribe(renderApp);
renderApp();
loadProducts();

async function loadProducts() {
  setState({
    status: 'loading',
    error: null,
  });

  try {
    const products = await fetchProducts();
    const normalizedProducts = products.map((product, index) => normalizeProduct(product, index));

    setState({
      products: normalizedProducts,
      status: 'success',
      error: null,
    });
  } catch (error) {
    setState({
      status: 'error',
      error: error.message,
    });
  }
}

function renderApp() {
  const state = getState();
  const viewModel = selectProductsViewModel(state);

  if (shouldClampPage(state, viewModel)) {
    setState({ page: viewModel.currentPage });
    return;
  }

  renderFilters({
    state,
    categories: viewModel.categories,
    viewModel,
  });
  renderProducts({
    state,
    visibleProducts: viewModel.visibleProducts,
    isPriceRangeInvalid: viewModel.isPriceRangeInvalid,
  });
  syncStateToUrl(getState());
}

function handleFilterChange(partialState) {
  setState({
    ...partialState,
    page: 1,
  });
}

function handleClearFilters() {
  setState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'default',
    page: 1,
  });
}

function handlePopState() {
  setState(readStateFromUrl());
}

function shouldClampPage(state, viewModel) {
  if (state.status !== 'success') {
    return false;
  }

  return state.page !== viewModel.currentPage;
}
