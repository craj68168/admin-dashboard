import type { ReactNode } from "react";

export type FilterValue = string;

export type FilterValues = Record<string, FilterValue>;

export type FilterOption = {
  label: string;
  value: string;
};

// =====================================
// MAIN SEARCH FIELD
// =====================================

export type SearchField<
  T extends FilterValues = FilterValues,
> = {
  name: keyof T;
  label?: string;
  placeholder?: string;
};

// =====================================
// TEXT FILTER
// =====================================

export type TextFilterField<
  T extends FilterValues = FilterValues,
> = {
  type: "text";

  name: keyof T;

  label: string;

  placeholder?: string;

  disabled?: boolean;

  colSpan?: 1 | 2 | 3;
};

// =====================================
// SELECT FILTER
// =====================================

export type SelectFilterField<
  T extends FilterValues = FilterValues,
> = {
  type: "select";

  name: keyof T;

  label: string;

  placeholder?: string;

  options: FilterOption[];

  disabled?: boolean;

  colSpan?: 1 | 2 | 3;
};

// =====================================
// DATE RANGE FILTER
// =====================================

export type DateRangeFilterField<
  T extends FilterValues = FilterValues,
> = {
  type: "dateRange";

  // Start date
  name: keyof T;

  // End date
  endName: keyof T;

  label: string;

  disabled?: boolean;

  colSpan?: 1 | 2 | 3;
};

// =====================================
// ALL FILTER TYPES
// =====================================

export type FilterField<
  T extends FilterValues = FilterValues,
> =
  | TextFilterField<T>
  | SelectFilterField<T>
  | DateRangeFilterField<T>;

// =====================================
// COMPONENT PROPS
// =====================================

export type SearchFilterProps<
  T extends FilterValues = FilterValues,
> = {
  searchField?: SearchField<T>;

  fields: FilterField<T>[];

  initialValues: T;

  onSearch: (values: T) => void;

  onReset?: (values: T) => void;

  title?: string;

  refineTitle?: string;

  searchButtonText?: string;

  resetButtonText?: string;

  isLoading?: boolean;

  rightAction?: ReactNode;
};


export type ClientFilterValues = {
  keyword: string;
  visaType: string;
  coeStatus: string;
  clientStatus: string;
  assignedStaff: string;
};