"use client";

import { useId, useState } from "react";
import { createTranslator, useLocale } from "next-intl";
import {
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Collapse,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import type { SearchFilterProps } from "@/components/common/SearchFilter/types";
import type { ClientFilterValues } from "./type";

const messages = {
  en: {
    title: "Client Filters", show: "Show filters", hide: "Hide filters",
    active: "{count} active filters", reset: "Reset", search: "Search",
    noOptions: "No options found", clear: "Clear", open: "Open", close: "Close",
    remove: "Remove {label} filter: {value}",
  },
  ja: {
    title: "顧客の絞り込み", show: "フィルターを表示", hide: "フィルターを非表示",
    active: "{count}件のフィルターが適用中", reset: "リセット", search: "検索",
    noOptions: "該当する項目はありません", clear: "クリア", open: "開く", close: "閉じる",
    remove: "{label}フィルターを解除：{value}",
  },
};

const BRAND = "#107A64";
const BRAND_DEEP = "#0A5A49";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#ffffff",
    fontSize: 14,
    "& fieldset": { borderColor: "rgba(17, 24, 39, 0.12)" },
    "&:hover fieldset": { borderColor: "rgba(16, 122, 100, 0.40)" },
    "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: 1 },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: BRAND },
};

const focusRing = {
  "&:focus-visible": { outline: `2px solid ${BRAND}`, outlineOffset: 2 },
};

const edgeX = { xs: 2, sm: 2.5 };

export default function StaffClientFilters({
  searchField,
  fields,
  initialValues,
  onSearch,
  onReset,
  searchButtonText,
  isLoading = false,
  rightAction,
}: SearchFilterProps<ClientFilterValues>) {
  const locale = useLocale();
  const t = createTranslator({ locale, messages: messages[locale === "ja" ? "ja" : "en"] });
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(initialValues);

  const selectFields = fields.filter((field) => field.type === "select");

  const chips = selectFields.flatMap((field) => {
    const value = initialValues[field.name];

    return value
      ? [
          {
            name: field.name,
            label: field.label,
            value: field.options.find((option) => option.value === value)?.label || value,
          },
        ]
      : [];
  });

  if (searchField && initialValues[searchField.name]) {
    chips.unshift({
      name: searchField.name,
      label: searchField.label || t("search"),
      value: initialValues[searchField.name],
    });
  }

  const canReset = Object.values(draft).some(Boolean) || chips.length > 0;

  const reset = () => {
    const empty: ClientFilterValues = {
      keyword: "",
      currentVisaStatus: "",
      preferCategory: "",
      currentStage: "",
      japaneseLevel: "",
      nationality: "",
      assignedStaff: "",
    };

    setDraft(empty);

    if (onReset) onReset(empty);
    else onSearch(empty);
  };

  return (
    <Paper
      elevation={0}
      role="search"
      sx={{
        borderRadius: 3,
        border: `1px solid ${HAIRLINE}`,
        bgcolor: "#ffffff",
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0.5,
          pr: { xs: 1, md: 2 },
          bgcolor: open ? "rgba(16, 122, 100, 0.04)" : "#ffffff",
          transition: "background-color 240ms ease",
          "&:hover": { bgcolor: "rgba(16, 122, 100, 0.06)" },
        }}
      >
        <ButtonBase
          onClick={() => setOpen((previous) => !previous)}
          aria-expanded={open}
          aria-controls={panelId}
          sx={{
            flex: "1 1 220px",
            minWidth: 0,
            minHeight: 44,
            px: edgeX,
            py: 1.25,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            textAlign: "left",
            "&:focus-visible": { outline: `2px solid ${BRAND}`, outlineOffset: -2 },
          }}
        >
          <Box component="span" sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
            <Typography
              component="span"
              sx={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2, color: "#0F172A" }}
            >
              {t("title")}
            </Typography>

            {chips.length > 0 && (
              <Box
                component="span"
                aria-label={t("active", { count: chips.length })}
                sx={{
                  px: 0.875,
                  py: 0.125,
                  borderRadius: 999,
                  bgcolor: BRAND,
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {chips.length}
              </Box>
            )}
          </Box>

          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.75, color: BRAND, flexShrink: 0 }}>
            <Typography
              component="span"
              sx={{ display: { xs: "none", sm: "inline" }, fontSize: 12.5, fontWeight: 600 }}
            >
              {t(open ? "hide" : "show")}
            </Typography>

            <ExpandMoreOutlinedIcon
              sx={{
                fontSize: 20,
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 300ms ease",
              }}
            />
          </Box>
        </ButtonBase>

        {canReset && (
          <Button
            type="button"
            size="small"
            startIcon={<RestartAltOutlinedIcon />}
            onClick={reset}
            disabled={isLoading}
            sx={{
              color: BRAND,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 999,
              "&:hover": { bgcolor: "rgba(16, 122, 100, 0.08)" },
            }}
          >
            {t("reset")}
          </Button>
        )}
      </Box>

      {/* PANEL */}

      <Collapse in={open} id={panelId}>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(draft);
          }}
          sx={{
            px: edgeX,
            pb: { xs: 2, md: 2.5 },
            pt: 2,
            borderTop: `1px solid ${HAIRLINE}`,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.25 }}>
            {searchField && (
              <TextField
                fullWidth
                size="small"
                label={searchField.label || t("search")}
                placeholder={searchField.placeholder}
                value={draft[searchField.name]}
                onChange={(event) =>
                  setDraft((previous) => ({ ...previous, [searchField.name]: event.target.value }))
                }
                sx={fieldSx}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={<SearchOutlinedIcon />}
              sx={{
                minWidth: 112,
                height: 40,
                width: { xs: "100%", sm: "auto" },
                flexShrink: 0,
                borderRadius: 2,
                bgcolor: BRAND,
                boxShadow: "none",
                textTransform: "none",
                fontSize: 13.5,
                fontWeight: 600,
                "&:hover": { bgcolor: BRAND_DEEP, boxShadow: "none" },
              }}
            >
              {searchButtonText || t("search")}
            </Button>
          </Box>

          <Box
            sx={{
              mt: 1.5,
              display: "grid",
              gap: 1.25,
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            }}
          >
            {selectFields.map((field) => (
              <Autocomplete
                key={field.name}
                fullWidth
                autoHighlight
                clearOnEscape
                disabled={field.disabled}
                options={field.options}
                value={field.options.find((option) => option.value === draft[field.name]) ?? null}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, selected) => option.value === selected.value}
                onChange={(_event, option) =>
                  setDraft((previous) => ({ ...previous, [field.name]: option?.value ?? "" }))
                }
                noOptionsText={t("noOptions")}
                clearText={t("clear")}
                openText={t("open")}
                closeText={t("close")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label={field.label}
                    placeholder={field.placeholder}
                    sx={fieldSx}
                  />
                )}
              />
            ))}
          </Box>
        </Box>
      </Collapse>

      {/* ACTIVE FILTER CHIPS */}

      {!open && chips.length > 0 && (
        <Box
          sx={{
            px: edgeX,
            py: 1.25,
            borderTop: `1px solid ${HAIRLINE}`,
            display: "flex",
            flexWrap: "wrap",
            gap: 0.75,
          }}
        >
          {chips.map((chip) => (
            <Box
              key={chip.name}
              component="button"
              type="button"
              disabled={isLoading}
              aria-label={t("remove", { label: chip.label, value: chip.value })}
              onClick={() => {
                setDraft((previous) => ({ ...previous, [chip.name]: "" }));
                onSearch({ ...initialValues, [chip.name]: "" });
              }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                maxWidth: "100%",
                pl: 1.25,
                pr: 0.75,
                py: 0.375,
                font: "inherit",
                textAlign: "left",
                borderRadius: 999,
                bgcolor: "rgba(16, 122, 100, 0.07)",
                border: "1px solid rgba(16, 122, 100, 0.20)",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(16, 122, 100, 0.14)" },
                ...focusRing,
              }}
            >
              <Typography component="span" sx={{ fontSize: 12, color: "#5B6A7E", fontWeight: 600, flexShrink: 0 }}>
                {chip.label}
              </Typography>

              <Typography
                component="span"
                sx={{
                  fontSize: 12,
                  color: BRAND_DEEP,
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {chip.value}
              </Typography>

              <CloseOutlinedIcon sx={{ fontSize: 14, color: "#5B6A7E", flexShrink: 0 }} />
            </Box>
          ))}
        </Box>
      )}

      {/* RIGHT ACTION (EXPORT) */}

      {rightAction && (
        <Box
          sx={{
            px: edgeX,
            py: 1.25,
            borderTop: `1px solid ${HAIRLINE}`,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {rightAction}
        </Box>
      )}
    </Paper>
  );
}