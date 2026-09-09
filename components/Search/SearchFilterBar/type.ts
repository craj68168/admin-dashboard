import { FilterOption } from "../FilterSelect/type";
import { FilterComboboxOption } from "../FilterCombobox/type";

export type FilterType = "select" | "combobox";

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  placeholder?: string;

  options:
    | FilterOption[]
    | FilterComboboxOption[];

  disabled?: boolean;
  loading?: boolean;
}

export interface SearchFilterValues {
  search: string;
  filters: Record<string, string>;
}

export interface SearchFilterBarProps {
  searchLabel?: string;
  searchPlaceholder?: string;

  filters: FilterConfig[];

  searchParamKey?: string;
  pageParamKey?: string;

  onSubmit?: (
    values: SearchFilterValues
  ) => void;
}

export interface UseSearchFilterBarProps {
  filters: FilterConfig[];
  searchParamKey?: string;
  pageParamKey?: string;

  onSubmit?: (
    values: SearchFilterValues
  ) => void;
}