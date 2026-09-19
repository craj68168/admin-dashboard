"use client";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";

export type SearchableSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SearchableSelectProps = {
  name?: string;
  value?: string;
  options: SearchableSelectOption[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  sx?: SxProps<Theme>;
};

export default function SearchableSelect({
  name,
  value = "",
  options,
  label,
  placeholder,
  required = false,
  disabled = false,
  error = false,
  helperText,
  onChange,
  onBlur,
  sx,
}: SearchableSelectProps) {
  const selectedOption = options.find((option) => option.value === value) ?? null;

  return (
    <Autocomplete
      disablePortal
      fullWidth
      options={options}
      value={selectedOption}
      disabled={disabled}
      getOptionLabel={(option) => option.label}
      getOptionDisabled={(option) => option.disabled === true}
      isOptionEqualToValue={(option, selected) => option.value === selected.value}
      onChange={(_event, option) => onChange(option?.value ?? "")}
      onBlur={onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          sx={sx}
        />
      )}
    />
  );
}
