import { SelectChangeEvent } from "@mui/material";

import { UseFilterSelectProps } from "./type";

export const useFilterSelect = ({
  onChange,
}: UseFilterSelectProps) => {
  const handleChange = (
    event: SelectChangeEvent<string>
  ) => {
    onChange(event.target.value);
  };

  return {
    handleChange,
  };
};