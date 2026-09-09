"use client";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import { useFilterSelect } from "./hook";
import { FilterSelectProps } from "./type";

const FilterSelect = ({
  label,
  value,
  options,
  placeholder = "Select",
  disabled = false,
  onChange,
}: FilterSelectProps) => {
  const { handleChange } = useFilterSelect({
    onChange,
  });

  return (
    <FormControl
      fullWidth
      sx={{
        display: "flex",
        gap: "8px",
      }}
    >
      <Typography
        component="label"
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#1F2937",
        }}
      >
        {label}
      </Typography>

      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        disabled={disabled}
        IconComponent={KeyboardArrowDownIcon}
        sx={{
          height: "44px",

          backgroundColor: "#FFFFFF",

          borderRadius: "6px",

          fontSize: "14px",

          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",

            padding: "10px 14px",
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D1D5DB",
          },

          "&:hover .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#9CA3AF",
            },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "primary.main",
              borderWidth: "1px",
            },

          "& .MuiSvgIcon-root": {
            color: "#6B7280",
            fontSize: "22px",
          },
        }}
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                mt: "4px",

                maxHeight: "300px",

                borderRadius: "6px",

                boxShadow:
                  "0px 4px 12px rgba(0,0,0,0.08)",

                "& .MuiMenuItem-root": {
                  minHeight: "40px",

                  fontSize: "14px",

                  "&:hover": {
                    backgroundColor: "#F3F4F6",
                  },

                  "&.Mui-selected": {
                    backgroundColor: "#F3F4F6",
                    fontWeight: 600,
                  },

                  "&.Mui-selected:hover": {
                    backgroundColor: "#E5E7EB",
                  },
                },
              },
            },
          },
        }}
      >
        <MenuItem
          value=""
          sx={{
            color: "#9CA3AF",
          }}
        >
          {placeholder}
        </MenuItem>

        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;