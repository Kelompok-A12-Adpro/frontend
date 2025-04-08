// PATH : ROOT-FE/src/libs/tanstack-query/options.ts
export const defaultQueryClientOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const defaultUseQueryOptions = {
  refetchOnWindowFocus: false,
  retry: false,
};

export const paginationUseQueryOption = {
  refetchOnWindowFocus: false,
  retry: false,
  keepPreviousData: true,
};
