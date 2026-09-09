import {
  SyntheticEvent,
  useMemo,
} from "react";

import {
  FilterComboboxOption,
  UseFilterComboboxProps,
} from "./type";

export const useFilterCombobox = ({
  value,
  options,
  onChange,
}: UseFilterComboboxProps) => {
  const selectedOption = useMemo(() => {
    return (
      options.find(
        (option) => option.value === value
      ) ?? null
    );
  }, [options, value]);

  const handleChange = (
    _: SyntheticEvent,
    newValue: FilterComboboxOption | null
  ) => {
    onChange(newValue?.value ?? "");
  };

  return {
    selectedOption,
    handleChange,
  };
};