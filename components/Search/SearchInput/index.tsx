"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
  InputAdornment,
  TextField,
} from "@mui/material";

import { useSearchInput } from "./hook";
import { SearchInputProps } from "./type";

const SearchInput = ({
  value = "",
  placeholder = "Search...",
  disabled = false,
  onChange,
}: SearchInputProps) => {
  const { handleChange } = useSearchInput({
    onChange,
  });

  return (
    <TextField
      fullWidth
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "44px",
          backgroundColor: "#FFFFFF",
          borderRadius: "6px",

          "& fieldset": {
            borderColor: "#D1D5DB",
          },

          "&:hover fieldset": {
            borderColor: "#9CA3AF",
          },

          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
            borderWidth: "1px",
          },
        },

        "& .MuiInputBase-input": {
          fontSize: "14px",
          fontWeight: 400,
          padding: "10px 0",

          "&::placeholder": {
            color: "#9CA3AF",
            opacity: 1,
          },
        },

        "& .MuiInputAdornment-root": {
          marginRight: "8px",
        },

        "& .MuiSvgIcon-root": {
          fontSize: "20px",
          color: "#6B7280",
        },
      }}
    />
  );
};

export default SearchInput;