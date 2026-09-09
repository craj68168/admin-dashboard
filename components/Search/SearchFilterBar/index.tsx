"use client";

import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import SearchInput from "../SearchInput";
import FilterSelect from "../FilterSelect";
import FilterCombobox from "../FilterCombobox";

import { useSearchFilterBar } from "./hook";
import { SearchFilterBarProps } from "./type";

const SearchFilterBar = ({
  searchLabel = "Free words",
  searchPlaceholder = "Search...",
  filters,

  searchParamKey = "search",
  pageParamKey = "page",

  onSubmit,
}: SearchFilterBarProps) => {
  const {
    search,
    filterValues,

    handleSearchChange,
    handleFilterChange,

    handleSubmit,
    handleReset,
  } = useSearchFilterBar({
    filters,
    searchParamKey,
    pageParamKey,
    onSubmit,
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",

        padding: "24px",

        backgroundColor: "#FFFFFF",

        border: "1px solid",
        borderColor: "#E5E7EB",

        borderRadius: "8px",
      }}
    >
      {/* Fields */}
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            md: "repeat(2, minmax(0, 1fr))",

            lg: "repeat(3, minmax(0, 1fr))",
          },

          columnGap: "24px",

          rowGap: "20px",
        }}
      >
        {/* Search */}
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
            {searchLabel}
          </Typography>

          <SearchInput
            value={search}
            placeholder={
              searchPlaceholder
            }
            onChange={
              handleSearchChange
            }
          />
        </Box>

        {/* Filters */}
        {filters.map((filter) => {
          const value =
            filterValues[
              filter.key
            ] ?? "";

          if (
            filter.type ===
            "combobox"
          ) {
            return (
              <FilterCombobox
                key={filter.key}
                label={filter.label}
                value={value}
                options={filter.options}
                placeholder={
                  filter.placeholder
                }
                disabled={
                  filter.disabled
                }
                loading={
                  filter.loading
                }
                onChange={(
                  newValue
                ) =>
                  handleFilterChange(
                    filter.key,
                    newValue
                  )
                }
              />
            );
          }

          return (
            <FilterSelect
              key={filter.key}
              label={filter.label}
              value={value}
              options={filter.options}
              placeholder={
                filter.placeholder
              }
              disabled={
                filter.disabled
              }
              onChange={(
                newValue
              ) =>
                handleFilterChange(
                  filter.key,
                  newValue
                )
              }
            />
          );
        })}
      </Box>

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          gap: "12px",

          marginTop: "24px",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          startIcon={<SearchIcon />}
          sx={{
            minWidth: "110px",

            height: "42px",

            paddingX: "20px",

            borderRadius: "6px",

            fontSize: "14px",

            fontWeight: 600,

            textTransform: "none",

            boxShadow: "none",

            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Search
        </Button>

        <Button
          type="button"
          variant="outlined"
          startIcon={
            <RestartAltIcon />
          }
          onClick={handleReset}
          sx={{
            minWidth: "110px",

            height: "42px",

            paddingX: "20px",

            borderRadius: "6px",

            fontSize: "14px",

            fontWeight: 600,

            textTransform: "none",
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default SearchFilterBar;