import { filterProducts, isPriceRangeInvalid } from './filters.js';
import { paginateProducts } from './pagination.js';
import { sortProducts } from './sorting.js';

export const PAGE_SIZES = [8, 12, 24];
export const DEFAULT_PAGE_SIZE = 12;
export const SORT_OPTIONS = ['default', 'price-asc', 'price-desc', 'name-asc', 'name-desc'];

export function selectProductsViewModel(state) {
  const categories = selectCategories(state.products);
  const isInvalidPriceRange = isPriceRangeInvalid(state.minPrice, state.maxPrice);

  if (isInvalidPriceRange) {
    // stop here so invalid filters dont show fake results
    return {
      categories,
      filteredProducts: [],
      visibleProducts: [],
      totalResults: 0,
      totalPages: 0,
      currentPage: 1,
      isPriceRangeInvalid: true,
    };
  }

  const filteredProducts = filterProducts(state.products, {
    category: state.category,
    minPrice: state.minPrice,
    maxPrice: state.maxPrice,
  });
  const sortedProducts = sortProducts(filteredProducts, state.sortBy);
  const pagination = paginateProducts(sortedProducts, state.page, state.pageSize);

  return {
    categories,
    filteredProducts,
    visibleProducts: pagination.visibleProducts,
    totalResults: pagination.totalResults,
    totalPages: pagination.totalPages,
    currentPage: pagination.currentPage,
    isPriceRangeInvalid: false,
  };
}

function selectCategories(products) {
  // categories come from api, so keep this list derived
  return [...new Set(products.map((product) => product.category))]
    .filter(Boolean)
    .sort((firstCategory, secondCategory) =>
      firstCategory.localeCompare(secondCategory, 'pl', { sensitivity: 'base' }),
    );
}
