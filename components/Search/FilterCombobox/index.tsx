"use client";

import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
  Box,
} from "@mui/material";

import { useFilterCombobox } from "./hook";
import { FilterComboboxProps } from "./type";

const FilterCombobox = ({
  label,
  value,
  options,
  placeholder = "Search...",
  disabled = false,
  loading = false,
  onChange,
}: FilterComboboxProps) => {
  const {
    selectedOption,
    handleChange,
  } = useFilterCombobox({
    value,
    options,
    onChange,
  });

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Typography
        component="label"
        sx={{
          display: "block",
          marginBottom: "8px",

          fontSize: "14px",
          fontWeight: 600,

          color: "#1F2937",
        }}
      >
        {label}
      </Typography>

      <Autocomplete
        value={selectedOption}
        options={options}
        loading={loading}
        disabled={disabled}
        onChange={handleChange}
        getOptionLabel={(option) =>
          option.label
        }
        isOptionEqualToValue={(
          option,
          selected
        ) =>
          option.value === selected.value
        }
        noOptionsText="No results found"
        loadingText="Loading..."
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            slotProps={{
              input: {
                ...params.slotProps.input,

                endAdornment: (
                  <>
                    {loading && (
                      <CircularProgress
                        size={18}
                      />
                    )}

                    {params.slotProps.input.endAdornment}
                  </>
                ),
              },
              htmlInput: params.slotProps.htmlInput,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                minHeight: "44px",
                paddingTop: "0px",
                paddingBottom: "0px",

                backgroundColor:
                  "#FFFFFF",

                borderRadius: "6px",

                "& fieldset": {
                  borderColor:
                    "#D1D5DB",
                },

                "&:hover fieldset": {
                  borderColor:
                    "#9CA3AF",
                },

                "&.Mui-focused fieldset":
                  {
                    borderColor:
                      "primary.main",

                    borderWidth:
                      "1px",
                  },
              },

              "& .MuiInputBase-input": {
                fontSize: "14px",

                "&::placeholder": {
                  color: "#9CA3AF",
                  opacity: 1,
                },
              },

              "& .MuiAutocomplete-popupIndicator":
                {
                  color: "#6B7280",
                },

              "& .MuiAutocomplete-clearIndicator":
                {
                  color: "#6B7280",
                },
            }}
          />
        )}
        slotProps={{
          paper: {
            sx: {
              marginTop: "4px",

              borderRadius: "6px",

              boxShadow:
                "0px 4px 12px rgba(0, 0, 0, 0.08)",

              "& .MuiAutocomplete-option":
                {
                  minHeight: "40px",

                  fontSize: "14px",

                  "&[aria-selected='true']":
                    {
                      backgroundColor:
                        "#F3F4F6",

                      fontWeight: 600,
                    },

                  "&.Mui-focused": {
                    backgroundColor:
                      "#F3F4F6",
                  },
                },
            },
          },
        }}
      />
    </Box>
  );
};

export default FilterCombobox;