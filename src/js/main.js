import '../scss/main.scss';

import { fetchProducts } from './api/productsApi.js';
import { normalizeProduct } from './domain/normalizeProduct.js';
import { selectProductsViewModel } from './domain/selectors.js';
import { getState, setState, subscribe } from './state/store.js';
import { readStateFromUrl, syncStateToUrl } from './state/urlState.js';
import { renderProducts, setupProductsGrid } from './ui/renderProducts.js';

setupProductsGrid({
  onProductSelect: () => {},
});

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

  renderProducts({
    state,
    visibleProducts: viewModel.visibleProducts,
    isPriceRangeInvalid: viewModel.isPriceRangeInvalid,
  });
  syncStateToUrl(getState());
}
