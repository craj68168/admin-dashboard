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

// Single source of truth so every input field lines up.
const CONTROL_HEIGHT = 36;
// Buttons stay a touch smaller than the fields — feels lighter, less heavy.
const BUTTON_HEIGHT = 32;

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
  },
};

// Shared by every input so they stay identical in height, radius and state.
// 16px font on phones stops iOS Safari from zooming when a field is focused.
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: CONTROL_HEIGHT,
    borderRadius: 2.5,
    bgcolor: "#ffffff",
    transition: "box-shadow 150ms ease, border-color 150ms ease",

    "& fieldset": { borderColor: HAIRLINE_STRONG, transition: "border-color 150ms ease" },
    "&:hover fieldset": { borderColor: "rgba(17, 24, 39, 0.34)" },

    "&.Mui-focused": { boxShadow: `0 0 0 3px ${BRAND_GLOW}` },
    "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: 1.5 },
    "&.Mui-focused .MuiInputAdornment-root svg": { color: BRAND },

    "&.Mui-disabled": { bgcolor: "#F3F4F6" },
  },
  "& .MuiInputBase-input": {
    fontSize: { xs: 16, sm: 13.5 },
    color: INK,
    minWidth: 0,
    py: 0,
    "&::placeholder": { color: INK_FAINT, opacity: 1 },
  },
};

const labelSx = {
  display: "block",
  mb: 0.5,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.02em",
  color: INK_LABEL,
};

const popupPaperSx = {
  mt: 0.75,
  borderRadius: 3,
  border: `1px solid ${HAIRLINE}`,
  boxShadow: "0 20px 48px -16px rgba(17, 24, 39, 0.32)",
  "& .MuiAutocomplete-option": {
    mx: 0.75,
    my: 0.25,
    borderRadius: 2,
    fontSize: 14,
    minHeight: 36,
    transition: "background-color 120ms ease",
    '&[aria-selected="true"]': { bgcolor: BRAND_SOFT, fontWeight: 600 },
    "&.Mui-focused": { bgcolor: BRAND_SOFT },
  },
};

// Shared base for every pill-shaped button (filters toggle, search, reset)
// so height/radius/typography never drift apart again.
const pillButtonSx = {
  minHeight: BUTTON_HEIGHT,
  borderRadius: 2.5,
  textTransform: "none",
  fontSize: 13,
  fontWeight: 600,
  "& .MuiButton-startIcon": { marginRight: 0.5 },
  "& .MuiButton-startIcon > *:nth-of-type(1)": { fontSize: "16px !important" },
  transition: "background-color 150ms ease, box-shadow 150ms ease, transform 100ms ease",
  "&:active": { transform: "scale(0.98)" },
  ...focusRing,
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
        borderRadius: 3.5,
        border: "1px solid",
        borderColor: HAIRLINE,
        bgcolor: "#ffffff",
        boxShadow:
          "0 1px 2px rgba(17,24,39,0.04), 0 20px 48px -24px rgba(17,24,39,0.35)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { xs: 1.75, sm: 2 } }}>
        {/* ================================= */}
        {/* MAIN SEARCH */}
        {/* ================================= */}

        {searchField && (
          <TextField
            fullWidth
            size="small"
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
                    <SearchIcon sx={{ fontSize: 18, color: INK_FAINT }} />
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
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{ ...fieldSx, mb: hasFilters ? { xs: 1.25, md: 1.75 } : 0 }}
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
              ...pillButtonSx,
              display: { xs: "flex", md: "none" },
              width: "100%",
              justifyContent: "space-between",
              px: 1.5,
              border: `1px solid ${filtersOpen ? BRAND : HAIRLINE_STRONG}`,
              color: INK,
              bgcolor: filtersOpen ? BRAND_SOFT : "transparent",
              "&:hover": { bgcolor: BRAND_SOFT, borderColor: BRAND },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterListIcon sx={{ fontSize: 20, color: filtersOpen ? BRAND : INK_MUTED }} />
              {refineTitle}
              {activeCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    minWidth: 18,
                    height: 18,
                    px: 0.625,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 999,
                    background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
                    boxShadow: `0 0 0 3px ${BRAND_GLOW}`,
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1,
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
                  pt: { xs: 1.5, md: 0 },
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: { xs: 1.25, sm: 1.5 },
                }}
              >
                {fields.map((field) => {
                  const fieldName = String(field.name);
                  const inputId = `${uid}-${fieldName}`;
                  const span = Math.min(field.colSpan ?? 1, 3);
                  const gridColumn = {
                    xs: "span 1",
                    sm: `span ${Math.min(span, 2)}`,
                    lg: `span ${span}`,
                  };

                  // ===========================
                  // SELECT FILTER
                  // ===========================

                  if (field.type === "select") {
                    return (
                      <Box key={fieldName} sx={{ gridColumn }}>
                        <Typography component="label" htmlFor={inputId} sx={labelSx}>
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
                          size="small"
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
                      <Box key={`${fieldName}-${String(field.endName)}`} sx={{ gridColumn }}>
                        <Typography component="span" id={labelId} sx={labelSx}>
                          {field.label}
                        </Typography>

                        <Box
                          role="group"
                          aria-labelledby={labelId}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
                            alignItems: "center",
                            gap: 0.75,
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            value={values[field.name] ?? ""}
                            disabled={field.disabled}
                            onChange={(event) => handleChange(field.name, event.target.value)}
                            slotProps={{
                              htmlInput: { "aria-label": `${field.label} (${t("from")})` },
                            }}
                            sx={fieldSx}
                          />

                          <Box
                            aria-hidden
                            sx={{
                              width: 12,
                              height: 1.5,
                              borderRadius: 1,
                              bgcolor: HAIRLINE_STRONG,
                            }}
                          />

                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            value={values[field.endName] ?? ""}
                            disabled={field.disabled}
                            onChange={(event) => handleChange(field.endName, event.target.value)}
                            slotProps={{
                              htmlInput: { "aria-label": `${field.label} (${t("to")})` },
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
                      <Typography component="label" htmlFor={inputId} sx={labelSx}>
                        {field.label}
                      </Typography>

                      <TextField
                        id={inputId}
                        fullWidth
                        size="small"
                        value={values[field.name] ?? ""}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        onChange={(event) => handleChange(field.name, event.target.value)}
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
          px: { xs: 1.75, sm: 2 },
          py: 1.25,
          borderTop: `1px solid ${HAIRLINE}`,
          bgcolor: SURFACE_TINT,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.25,
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
              ...pillButtonSx,
              flex: { xs: 1, sm: "none" },
              px: 2,
              color: "#ffffff",
              background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
              boxShadow: `0 6px 16px -6px ${BRAND_GLOW}`,
              "&:hover": {
                background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND_DARK})`,
                boxShadow: `0 8px 20px -6px rgba(16, 122, 100, 0.45)`,
              },
              "&.Mui-disabled": {
                background: BRAND,
                color: "#ffffff",
                opacity: 0.6,
                boxShadow: "none",
              },
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
              ...pillButtonSx,
              px: 1.5,
              color: INK_MUTED,
              "&:hover": { bgcolor: "rgba(17, 24, 39, 0.06)", color: INK },
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