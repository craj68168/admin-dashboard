import {
  FormEvent,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  SearchFilterValues,
  UseSearchFilterBarProps,
} from "./type";

type SearchFilterState = {
  search: string;
  filterValues: Record<string, string>;
};

type SearchFilterAction =
  | { type: "sync"; search: string; filterValues: Record<string, string> }
  | { type: "search"; value: string }
  | { type: "filter"; key: string; value: string }
  | { type: "reset"; filterValues: Record<string, string> };

function searchFilterReducer(
  state: SearchFilterState,
  action: SearchFilterAction,
): SearchFilterState {
  switch (action.type) {
    case "sync":
      return { search: action.search, filterValues: action.filterValues };
    case "search":
      return { ...state, search: action.value };
    case "filter":
      return {
        ...state,
        filterValues: { ...state.filterValues, [action.key]: action.value },
      };
    case "reset":
      return { search: "", filterValues: action.filterValues };
  }
}

export const useSearchFilterBar = ({
  filters,
  searchParamKey = "search",
  pageParamKey = "page",
  onSubmit,
}: UseSearchFilterBarProps) => {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  /*
   * Used to detect URL changes from:
   * - Search
   * - Reset
   * - refresh
   * - browser back / forward
   */
  const queryString = searchParams.toString();

  const filterKeys = useMemo(
    () => filters.map((filter) => filter.key),
    [filters]
  );

  /*
   * Read current filter values from URL.
   */
  const getFiltersFromUrl = () => {
    return Object.fromEntries(
      filterKeys.map((key) => [
        key,
        searchParams.get(key) ?? "",
      ])
    );
  };

  /*
   * STAGED LOCAL STATE
   *
   * Changing these values does NOT change the URL
   * and does NOT trigger TanStack Query.
   */
  const [state, dispatch] = useReducer(searchFilterReducer, {
    search: searchParams.get(searchParamKey) ?? "",
    filterValues: getFiltersFromUrl(),
  });
  const { search, filterValues } = state;

  /*
   * URL -> form
   *
   * Important for refresh and browser back/forward.
   */
  useEffect(() => {
    dispatch({
      type: "sync",
      search: searchParams.get(searchParamKey) ?? "",
      filterValues: getFiltersFromUrl(),
    });
  }, [getFiltersFromUrl, queryString, searchParamKey, searchParams]);

  /*
   * Search input only changes local staged state.
   */
  const handleSearchChange = (
    value: string
  ) => {
    dispatch({ type: "search", value });
  };

  /*
   * Select / Combobox also only changes local state.
   */
  const handleFilterChange = (
    key: string,
    value: string
  ) => {
    dispatch({ type: "filter", key, value });
  };

  /*
   * Convert submitted state into URL params.
   */
  const updateUrl = (
    values: SearchFilterValues
  ) => {
    /*
     * Start with existing params so we preserve:
     *
     * pageSize
     * sortBy
     * sortOrder
     * etc.
     */
    const params = new URLSearchParams(
      searchParams.toString()
    );

    /*
     * Remove old search param.
     */
    params.delete(searchParamKey);

    /*
     * Remove old filter params.
     */
    filterKeys.forEach((key) => {
      params.delete(key);
    });

    /*
     * A new search should always start at page 1.
     */
    params.delete(pageParamKey);

    const trimmedSearch =
      values.search.trim();

    if (trimmedSearch) {
      params.set(
        searchParamKey,
        trimmedSearch
      );
    }

    Object.entries(
      values.filters
    ).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const nextQuery =
      params.toString();

    const url = nextQuery
      ? `${pathname}?${nextQuery}`
      : pathname;

    router.replace(url, {
      scroll: false,
    });
  };

  /*
   * Only this actually applies filters.
   */
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const values: SearchFilterValues = {
      search,
      filters: filterValues,
    };

    updateUrl(values);

    onSubmit?.(values);
  };

  /*
   * Clear all search/filter fields.
   */
  const handleReset = () => {
    const clearedFilters =
      Object.fromEntries(
        filterKeys.map((key) => [
          key,
          "",
        ])
      );

    const values: SearchFilterValues = {
      search: "",
      filters: clearedFilters,
    };

    dispatch({ type: "reset", filterValues: clearedFilters });

    updateUrl(values);

    onSubmit?.(values);
  };

  return {
    search,
    filterValues,

    handleSearchChange,
    handleFilterChange,

    handleSubmit,
    handleReset,
  };
};