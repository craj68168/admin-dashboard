  "use client";

  import {
    useState,
    type KeyboardEvent,
  } from "react";

  import type {
    ClientFilterValues,
  } from "./types";

  import type {
    FilterValues,
    SearchFilterProps,
  } from "./types";

  export const useSearchFilter = <
    T extends FilterValues,
  >({
    initialValues,
    onSearch,
    onReset,
  }: SearchFilterProps<T>) => {
    const [values, setValues] =
      useState<T>(initialValues);

    // =====================================
    // CHANGE FIELD VALUE
    // =====================================

    const handleChange = (
      name: keyof T,
      value: string,
    ) => {
      setValues((previous) => ({
        ...previous,
        [name]: value,
      }));
    };

    // =====================================
    // SEARCH
    // =====================================

    const handleSearch = () => {
      onSearch(values);
    };

    // =====================================
    // RESET
    // =====================================

    const handleReset = () => {
      const resetValues = {
        ...initialValues,
      };

      setValues(resetValues);

      onReset?.(resetValues);
    };

    // =====================================
    // SEARCH WITH ENTER KEY
    // =====================================

    const handleKeyDown = (
      event: KeyboardEvent<HTMLElement>,
    ) => {
      if (event.key === "Enter") {
        event.preventDefault();

        handleSearch();
      }
    };

    return {
      values,

      handleChange,
      handleSearch,
      handleReset,
      handleKeyDown,
    };
  };
