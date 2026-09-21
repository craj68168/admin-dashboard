"use client";

import { useId, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslations } from "next-intl";
import { useSearchFilter } from "./hook";
import type { FilterValues, SearchFilterProps } from "./types";

// =================================================
// THEME TOKENS (same palette as the Staff page)
// =================================================

const BRAND = "#107A64";
const BRAND_DARK = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_GLOW = "rgba(16, 122, 100, 0.16)";

const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const HAIRLINE_STRONG = "rgba(17, 24, 39, 0.16)";

const INK = "#111827";
const INK_LABEL = "#374151";
const INK_MUTED = "#4B5563";
const INK_FAINT = "#6B7280";

const SURFACE_TINT = "#FAFAF9";

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
  },
};

// Shared by every input so they stay identical.
// 16px font on phones stops iOS Safari from zooming when a field is focused.
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    bgcolor: "#ffffff",
    transition: "box-shadow 150ms ease",

    "& fieldset": { borderColor: HAIRLINE_STRONG },
    "&:hover fieldset": { borderColor: "rgba(17, 24, 39, 0.34)" },

    "&.Mui-focused": { boxShadow: `0 0 0 3px ${BRAND_GLOW}` },
    "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: 1 },

    "&.Mui-disabled": { bgcolor: "#F3F4F6" },
  },
  "& .MuiInputBase-input": {
    fontSize: { xs: 16, sm: 14 },
    color: INK,
    minWidth: 0,
    "&::placeholder": { color: INK_FAINT, opacity: 1 },
  },
};

const labelSx = {
  display: "block",
  mb: 0.75,
  fontSize: 13,
  fontWeight: 600,
  color: INK_LABEL,
};

const popupPaperSx = {
  mt: 0.5,
  borderRadius: 2.5,
  border: `1px solid ${HAIRLINE}`,
  boxShadow: "0 16px 40px -16px rgba(17, 24, 39, 0.30)",
  "& .MuiAutocomplete-option": {
    mx: 0.75,
    borderRadius: 1.75,
    fontSize: 14,
    minHeight: 40,
    '&[aria-selected="true"]': { bgcolor: BRAND_SOFT },
    "&.Mui-focused": { bgcolor: BRAND_SOFT },
  },
};

export default function SearchFilter<T extends FilterValues>(
  props: SearchFilterProps<T>,
) {
  const t = useTranslations("commonSearchFilter");

  const {
    searchField,
    fields,
    title = t("title"),
    refineTitle = t("filters"),
    searchButtonText = t("search"),
    resetButtonText = t("clear"),
    isLoading = false,
    rightAction,
  } = props;

  const { values, handleChange, handleSearch, handleReset, handleKeyDown } =
    useSearchFilter(props);

  const uid = useId();
  const panelId = `${uid}-filters`;

  // How many filters currently have a value (date ranges count once).
  const activeCount = fields.reduce((count, field) => {
    if (field.type === "dateRange") {
      return count + (values[field.name] || values[field.endName] ? 1 : 0);
    }
    return count + (values[field.name] ? 1 : 0);
  }, 0);

  const searchValue = searchField ? String(values[searchField.name] ?? "") : "";
  const hasAnyValue = activeCount > 0 || searchValue !== "";
  const hasFilters = fields.length > 0;

  // Only matters below `md`; from `md` up the filters are always visible.
  const [filtersOpen, setFiltersOpen] = useState(activeCount > 0);

  return (
    <Paper
      elevation={0}
      role="search"
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: HAIRLINE,
        bgcolor: "#ffffff",
        boxShadow:
          "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        {/* ================================= */}
        {/* MAIN SEARCH */}
        {/* ================================= */}

        {searchField && (
          <TextField
            fullWidth
            value={searchValue}
            placeholder={searchField.placeholder || t("searchPlaceholder")}
            onChange={(event) =>
              handleChange(searchField.name, event.target.value)
            }
            onKeyDown={handleKeyDown}
            slotProps={{
              htmlInput: { "aria-label": searchField.label || title },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: INK_FAINT }} />
                  </InputAdornment>
                ),
                endAdornment: searchValue ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      edge="end"
                      aria-label={t("clearSearchText")}
                      onClick={() => handleChange(searchField.name, "")}
                      sx={{ color: INK_FAINT, ...focusRing }}
                    >
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{
              ...fieldSx,
              mb: hasFilters ? { xs: 1.5, md: 2.5 } : 0,
              "& .MuiOutlinedInput-root": {
                ...fieldSx["& .MuiOutlinedInput-root"],
                height: 48,
              },
            }}
          />
        )}

        {/* ================================= */}
        {/* FILTERS TOGGLE (phones + tablets) */}
        {/* ================================= */}

        {hasFilters && (
          <Button
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            aria-controls={panelId}
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
              justifyContent: "space-between",
              minHeight: 44,
              px: 1.75,
              borderRadius: 2.5,
              border: `1px solid ${HAIRLINE_STRONG}`,
              textTransform: "none",
              fontSize: 14,
              fontWeight: 600,
              color: INK,
              "&:hover": { bgcolor: BRAND_SOFT, borderColor: BRAND },
              ...focusRing,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterListIcon sx={{ fontSize: 20, color: INK_MUTED }} />
              {refineTitle}
              {activeCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    minWidth: 20,
                    height: 20,
                    px: 0.75,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 999,
                    bgcolor: BRAND,
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {activeCount}
                </Box>
              )}
            </Box>
            <ExpandMoreIcon
              sx={{
                color: INK_MUTED,
                transition: "transform 200ms ease",
                transform: filtersOpen ? "rotate(180deg)" : "none",
                "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              }}
            />
          </Button>
        )}

        {/* ================================= */}
        {/* FILTERS */}
        {/* ================================= */}

        {hasFilters && (
          <Box
            id={panelId}
            sx={{
              display: "grid",
              gridTemplateRows: { xs: filtersOpen ? "1fr" : "0fr", md: "1fr" },
              visibility: {
                xs: filtersOpen ? "visible" : "hidden",
                md: "visible",
              },
              transition: "grid-template-rows 220ms ease, visibility 220ms",
              "@media (prefers-reduced-motion: reduce)": { transition: "none" },
            }}
          >
            <Box sx={{ minHeight: 0, overflow: { xs: "hidden", md: "visible" } }}>
              <Box
                role="group"
                aria-label={refineTitle}
                sx={{
                  pt: { xs: 2, md: 0 },
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                {fields.map((field) => {
                  const fieldName = String(field.name);
                  const inputId = `${uid}-${fieldName}`;

                  const span = Math.min(field.colSpan ?? 1, 3);
                  const gridColumn = {
                    xs: "span 1",
                    sm: span >= 2 ? "span 2" : "span 1",
                    lg: `span ${span}`,
                  };

                  // ===========================
                  // SELECT FILTER
                  // ===========================

                  if (field.type === "select") {
                    return (
                      <Box key={fieldName} sx={{ gridColumn }}>
                        <Typography
                          component="label"
                          htmlFor={inputId}
                          sx={labelSx}
                        >
                          {field.label}
                        </Typography>

                        <Autocomplete
                          id={inputId}
                          options={field.options}
                          value={
                            field.options.find(
                              (option) => option.value === values[field.name],
                            ) ?? null
                          }
                          fullWidth
                          autoHighlight
                          disabled={field.disabled}
                          getOptionLabel={(option) => option.label}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                          }
                          onChange={(_event, option) =>
                            handleChange(field.name, option?.value ?? "")
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder={
                                field.placeholder ||
                                t("allField", { field: field.label })
                              }
                            />
                          )}
                          slotProps={{ paper: { sx: popupPaperSx } }}
                          sx={fieldSx}
                        />
                      </Box>
                    );
                  }

                  // ===========================
                  // DATE RANGE FILTER
                  // ===========================

                  if (field.type === "dateRange") {
                    const labelId = `${inputId}-label`;

                    return (
                      <Box
                        key={`${fieldName}-${String(field.endName)}`}
                        sx={{ gridColumn }}
                      >
                        <Typography
                          component="span"
                          id={labelId}
                          sx={labelSx}
                        >
                          {field.label}
                        </Typography>

                        <Box
                          role="group"
                          aria-labelledby={labelId}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            value={values[field.name] ?? ""}
                            disabled={field.disabled}
                            onChange={(event) =>
                              handleChange(field.name, event.target.value)
                            }
                            slotProps={{
                              htmlInput: {
                                "aria-label": `${field.label} (${t("from")})`,
                              },
                            }}
                            sx={fieldSx}
                          />

                          <Typography
                            aria-hidden
                            sx={{ color: INK_FAINT, fontWeight: 600 }}
                          >
                            –
                          </Typography>

                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            value={values[field.endName] ?? ""}
                            disabled={field.disabled}
                            onChange={(event) =>
                              handleChange(field.endName, event.target.value)
                            }
                            slotProps={{
                              htmlInput: {
                                "aria-label": `${field.label} (${t("to")})`,
                              },
                            }}
                            sx={fieldSx}
                          />
                        </Box>
                      </Box>
                    );
                  }

                  // ===========================
                  // TEXT FILTER
                  // ===========================

                  return (
                    <Box key={fieldName} sx={{ gridColumn }}>
                      <Typography
                        component="label"
                        htmlFor={inputId}
                        sx={labelSx}
                      >
                        {field.label}
                      </Typography>

                      <TextField
                        id={inputId}
                        fullWidth
                        size="small"
                        value={values[field.name] ?? ""}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        onChange={(event) =>
                          handleChange(field.name, event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        sx={fieldSx}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* ================================= */}
      {/* ACTION BAR */}
      {/* ================================= */}

      <Box
        sx={{
          px: { xs: 2, md: 2.5 },
          py: 1.5,
          borderTop: `1px solid ${HAIRLINE}`,
          bgcolor: SURFACE_TINT,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: { xs: "1 1 100%", sm: "0 1 auto" },
          }}
        >
          <Button
            variant="contained"
            disableElevation
            onClick={handleSearch}
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SearchIcon sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              flex: { xs: 1, sm: "none" },
              minHeight: 42,
              px: 2.5,
              borderRadius: 2.5,
              bgcolor: BRAND,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { bgcolor: BRAND_DARK, boxShadow: "none" },
              "&.Mui-disabled": {
                bgcolor: BRAND,
                color: "#ffffff",
                opacity: 0.65,
              },
              ...focusRing,
            }}
          >
            {isLoading ? t("searching") : searchButtonText}
          </Button>

          <Button
            variant="text"
            onClick={handleReset}
            disabled={isLoading || !hasAnyValue}
            startIcon={<RestartAltIcon sx={{ fontSize: 18 }} />}
            sx={{
              minHeight: 42,
              px: 1.75,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              color: INK_MUTED,
              "&:hover": { bgcolor: "rgba(17, 24, 39, 0.05)", color: INK },
              ...focusRing,
            }}
          >
            {resetButtonText}
          </Button>
        </Box>

        {rightAction && (
          <Box sx={{ width: { xs: "100%", sm: "auto" } }}>{rightAction}</Box>
        )}
      </Box>
    </Paper>
  );
}
