const pagination = document.querySelector('#pagination');

export function setupPagination({ onPageChange }) {
  pagination.addEventListener('click', (event) => {
    // pagination is rebuilt on every view change
    const pageButton = event.target.closest('[data-page]');

    if (!pageButton || pageButton.disabled) {
      return;
    }

    onPageChange(Number(pageButton.dataset.page));
  });
}

export function renderPagination({ state, viewModel }) {
  if (state.status !== 'success' || viewModel.isPriceRangeInvalid || viewModel.totalPages === 0) {
    // no pager while there is nothing useful to move through
    pagination.innerHTML = '';
    return;
  }

  const canGoPrevious = viewModel.currentPage > 1;
  const canGoNext = viewModel.currentPage < viewModel.totalPages;
  const previousPage = Math.max(1, viewModel.currentPage - 1);
  const nextPage = Math.min(viewModel.totalPages, viewModel.currentPage + 1);

  pagination.innerHTML = `
    <button
      class="button button--secondary pagination__button pagination__button--prev"
      type="button"
      data-page="${previousPage}"
      ${canGoPrevious ? '' : 'disabled'}
    >
      Poprzednia
    </button>
    <span class="pagination__status" aria-live="polite">
      Strona ${viewModel.currentPage} z ${viewModel.totalPages}
    </span>
    <button
      class="button button--secondary pagination__button pagination__button--next"
      type="button"
      data-page="${nextPage}"
      ${canGoNext ? '' : 'disabled'}
    >
      Następna
    </button>
  `;
}
