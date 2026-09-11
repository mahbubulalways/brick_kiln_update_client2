type TModifyQuery = {
  limit?: string;
  page?: string;
  search?: string;
};

export const modifyQuery = (query: TModifyQuery) => {
  const currentPage = Number(query.page) || 1;
  const currentLimit = Number(query.limit) || 10;
  const currentSearch = query.search || "";
  return {
    currentPage,
    currentLimit,
    currentSearch,
  };
};
