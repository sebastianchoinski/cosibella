export function paginateProducts(products, page, pageSize) {
  const totalResults = products.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  // url can point to a page that no longer exists
  const currentPage = getCurrentPage(page, totalPages);

  if (totalPages === 0) {
    return {
      visibleProducts: [],
      totalResults,
      totalPages,
      currentPage,
    };
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    visibleProducts: products.slice(startIndex, endIndex),
    totalResults,
    totalPages,
    currentPage,
  };
}

function getCurrentPage(page, totalPages) {
  if (totalPages === 0) {
    // empty list still has a stable page in state
    return 1;
  }

  if (page < 1) {
    return 1;
  }

  if (page > totalPages) {
    return totalPages;
  }

  return page;
}
