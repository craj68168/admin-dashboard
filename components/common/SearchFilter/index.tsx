"use client";

import {
  Box,
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { useSearchFilter } from "./hook";

import type { FilterValues, SearchFilterProps } from "./types";

export default function SearchFilter<T extends FilterValues>(
  props: SearchFilterProps<T>,
) {
  const {
    searchField,

    fields,

    title = "What are you looking for?",

    refineTitle = "REFINE RESULTS",

    searchButtonText = "Search",

    resetButtonText = "Clear",

    isLoading = false,

    rightAction,
  } = props;

  const {
    values,

    handleChange,

    handleSearch,

    handleReset,

    handleKeyDown,
  } = useSearchFilter(props);

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "#d9e2ec",

        borderRadius: 2,

        overflow: "hidden",

        backgroundColor: "#ffffff",
      }}
    >
      {/* ================================= */}
      {/* MAIN SEARCH */}
      {/* ================================= */}

      {searchField && (
        <Box
          sx={{
            p: {
              xs: 2,
              md: 2.5,
            },

            backgroundColor: "#f6f9fd",
          }}
        >
          <Typography
            sx={{
              mb: 1,

              fontSize: 13,

              fontWeight: 700,

              color: "#334155",
            }}
          >
            {searchField.label || title}
          </Typography>

          <TextField
            fullWidth
            size="small"
            value={values[searchField.name] ?? ""}
            placeholder={searchField.placeholder || "Search..."}
            onChange={(event) =>
              handleChange(searchField.name, event.target.value)
            }
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        fontSize: 18,
                        color: "primary.main",
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#ffffff",

                "& fieldset": {
                  borderColor: "#cfd8e3",
                },

                "&:hover fieldset": {
                  borderColor: "#94a3b8",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />
        </Box>
      )}

      {/* ================================= */}
      {/* FILTERS */}
      {/* ================================= */}

      {fields.length > 0 && (
        <Box
          sx={{
            px: {
              xs: 2,
              md: 2.5,
            },

            py: 2.5,
          }}
        >
          {/* ============================= */}
          {/* REFINE TITLE */}
          {/* ============================= */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1.5,

              mb: 2,
            }}
          >
            <Typography
              sx={{
                flexShrink: 0,

                fontSize: 11,

                fontWeight: 800,

                letterSpacing: 0.5,

                color: "#64748b",
              }}
            >
              {refineTitle}
            </Typography>

            <Divider
              sx={{
                flex: 1,
              }}
            />
          </Box>

          {/* ============================= */}
          {/* FILTER GRID */}
          {/* ============================= */}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                md: "repeat(2, minmax(0, 1fr))",

                lg: "repeat(3, minmax(0, 1fr))",
              },

              gap: 2,
            }}
          >
            {fields.map((field) => {
              const fieldName = field.name as string;

              const colSpan = field.colSpan ?? 1;

              const gridColumn = {
                xs: "span 1",

                md: colSpan >= 2 ? "span 2" : "span 1",

                lg: `span ${colSpan}`,
              };

              // ===========================
              // SELECT FILTER
              // ===========================

              if (field.type === "select") {
                return (
                  <Box
                    key={fieldName}
                    sx={{
                      gridColumn,
                    }}
                  >
                    <Typography
                      sx={{
                        mb: 0.75,

                        fontSize: 12,

                        fontWeight: 700,

                        color: "#475569",
                      }}
                    >
                      {field.label}
                    </Typography>

                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={values[field.name] ?? ""}
                      disabled={field.disabled}
                      onChange={(event) =>
                        handleChange(field.name, event.target.value)
                      }
                      slotProps={{
                        select: {
                          displayEmpty: true,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#f8fafc",

                          "& fieldset": {
                            borderColor: "#d7e0ea",
                          },

                          "&:hover fieldset": {
                            borderColor: "#94a3b8",
                          },

                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <Typography
                          component="span"
                          sx={{
                            color: "#64748b",

                            fontSize: 14,
                          }}
                        >
                          {field.placeholder ||
                            `All ${field.label.toLowerCase()}`}
                        </Typography>
                      </MenuItem>

                      {field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                );
              }

              // ===========================
              // DATE RANGE FILTER
              // ===========================

              if (field.type === "dateRange") {
                return (
                  <Box
                    key={`${String(field.name)}-${String(field.endName)}`}
                    sx={{
                      gridColumn,
                    }}
                  >
                    <Typography
                      sx={{
                        mb: 0.75,

                        fontSize: 12,

                        fontWeight: 700,

                        color: "#475569",
                      }}
                    >
                      {field.label}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: 1,
                      }}
                    >
                      {/* START DATE */}

                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        value={values[field.name] ?? ""}
                        disabled={field.disabled}
                        onChange={(event) =>
                          handleChange(field.name, event.target.value)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#f8fafc",

                            "& fieldset": {
                              borderColor: "#d7e0ea",
                            },

                            "&:hover fieldset": {
                              borderColor: "#94a3b8",
                            },

                            "&.Mui-focused fieldset": {
                              borderColor: "primary.main",
                            },
                          },
                        }}
                      />

                      <Typography
                        sx={{
                          color: "#94a3b8",

                          fontWeight: 600,
                        }}
                      >
                        -
                      </Typography>

                      {/* END DATE */}

                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        value={values[field.endName] ?? ""}
                        disabled={field.disabled}
                        onChange={(event) =>
                          handleChange(field.endName, event.target.value)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#f8fafc",

                            "& fieldset": {
                              borderColor: "#d7e0ea",
                            },

                            "&:hover fieldset": {
                              borderColor: "#94a3b8",
                            },

                            "&.Mui-focused fieldset": {
                              borderColor: "primary.main",
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                );
              }

              // ===========================
              // TEXT FILTER
              // ===========================

              return (
                <Box
                  key={fieldName}
                  sx={{
                    gridColumn,
                  }}
                >
                  <Typography
                    sx={{
                      mb: 0.75,

                      fontSize: 12,

                      fontWeight: 700,

                      color: "#475569",
                    }}
                  >
                    {field.label}
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    value={values[field.name] ?? ""}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    onChange={(event) =>
                      handleChange(field.name, event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f8fafc",

                        "& fieldset": {
                          borderColor: "#d7e0ea",
                        },

                        "&:hover fieldset": {
                          borderColor: "#94a3b8",
                        },

                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* ================================= */}
      {/* BOTTOM ACTION BAR */}
      {/* ================================= */}

      <Box
        sx={{
          px: {
            xs: 2,
            md: 2.5,
          },

          py: 1.5,

          borderTop: "1px solid",

          borderColor: "#e2e8f0",

          backgroundColor: "#f8fafc",

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          gap: 2,

          flexWrap: "wrap",
        }}
      >
        {/* LEFT BUTTONS */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 1,
          }}
        >
          <Button
            variant="contained"
            startIcon={
              <SearchIcon
                sx={{
                  fontSize: 17,
                }}
              />
            }
            onClick={handleSearch}
            disabled={isLoading}
            sx={{
              textTransform: "none",

              fontWeight: 700,

              px: 2,

              boxShadow: "none",

              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {isLoading ? "Searching..." : searchButtonText}
          </Button>

          <Button
            variant="text"
            startIcon={
              <RestartAltIcon
                sx={{
                  fontSize: 16,
                }}
              />
            }
            onClick={handleReset}
            disabled={isLoading}
            sx={{
              textTransform: "none",

              color: "#64748b",

              fontWeight: 600,
            }}
          >
            {resetButtonText}
          </Button>
        </Box>

        {/* RIGHT SIDE OPTIONAL ACTION */}

        {rightAction && <Box>{rightAction}</Box>}
      </Box>
    </Paper>
  );
}
