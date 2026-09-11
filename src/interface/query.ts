export type TQuery = {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
};
export type TQuerySearch = {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
};

export type TParams = {
  params: Promise<{ id: string }>;
};
