import { DEFAULT_STATE } from './store.js';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES, SORT_OPTIONS } from '../domain/selectors.js';

const URL_STATE_KEYS = ['category', 'minPrice', 'maxPrice', 'page', 'pageSize', 'sortBy'];

export function readStateFromUrl(search = window.location.search) {
  const params = new URLSearchParams(search);

  return {
    category: params.get('category') || DEFAULT_STATE.category,
    minPrice: normalizePriceParam(params.get('minPrice')),
    maxPrice: normalizePriceParam(params.get('maxPrice')),
    page: normalizePageParam(params.get('page')),
    pageSize: normalizePageSizeParam(params.get('pageSize')),
    sortBy: normalizeSortParam(params.get('sortBy')),
  };
}

export function syncStateToUrl(state) {
  const params = new URLSearchParams();

  // skip defaults so the url stays short
  if (state.category) {
    params.set('category', state.category);
  }

  if (state.minPrice) {
    params.set('minPrice', state.minPrice);
  }

  if (state.maxPrice) {
    params.set('maxPrice', state.maxPrice);
  }

  if (state.page > DEFAULT_STATE.page) {
    params.set('page', String(state.page));
  }

  if (state.pageSize !== DEFAULT_PAGE_SIZE) {
    params.set('pageSize', String(state.pageSize));
  }

  if (state.sortBy !== DEFAULT_STATE.sortBy) {
    params.set('sortBy', state.sortBy);
  }

  const queryString = params.toString();
  const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}${window.location.hash}`;

  window.history.replaceState(pickUrlState(state), '', nextUrl);
}

function normalizePriceParam(value) {
  if (!value) {
    return '';
  }

  const normalizedValue = value.replace(',', '.').trim();
  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return '';
  }

  return normalizedValue;
}

function normalizePageParam(value) {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return DEFAULT_STATE.page;
  }

  return parsedValue;
}

function normalizePageSizeParam(value) {
  const parsedValue = Number.parseInt(value, 10);

  if (!PAGE_SIZES.includes(parsedValue)) {
    return DEFAULT_PAGE_SIZE;
  }

  return parsedValue;
}

function normalizeSortParam(value) {
  if (!SORT_OPTIONS.includes(value)) {
    return DEFAULT_STATE.sortBy;
  }

  return value;
}

function pickUrlState(state) {
  return URL_STATE_KEYS.reduce((urlState, key) => {
    return {
      ...urlState,
      [key]: state[key],
    };
  }, {});
}
