export const DEFAULT_STATE = {
  products: [],
  status: 'idle',
  error: null,
  category: '',
  minPrice: '',
  maxPrice: '',
  page: 1,
  pageSize: 12,
  sortBy: 'default',
};

let state = { ...DEFAULT_STATE };
const listeners = new Set();

export function getState() {
  return state;
}

export function setState(partialState) {
  // tiny merge store, enough for this page
  state = {
    ...state,
    ...partialState,
  };

  listeners.forEach((listener) => listener(state));
}

export function subscribe(listener) {
  listeners.add(listener);

  // used if we ever split this into mounted views
  return () => {
    listeners.delete(listener);
  };
}
