"use client";

import type { ReactNode } from "react";

import { useTranslations } from "next-intl";

import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

import Breadcrumb from "@/components/Breadcrumb";

import { useAdminDashboard } from "./hook";

import type {
  DashboardPerformanceStatus,
  DashboardPaymentStatus,
} from "./type";

// =================================================
// THEME
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_BODY = "#1F2937";
const INK_MUTED = "#4B5563";

const softCard = {
  p: {
    xs: 2.5,
    md: 3,
  },
  borderRadius: 3,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

const labelSx = {
  fontSize: 12,
  fontWeight: 600,
  color: INK_MUTED,
  letterSpacing: 0.2,
};

const valueSx = {
  mt: 0.75,
  fontSize: 20,
  fontWeight: 600,
  color: INK,
  lineHeight: 1.25,
};

const headCellSx = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  color: INK_MUTED,
  borderBottomColor: HAIRLINE,
  py: 1.5,
  whiteSpace: "nowrap",
};

const bodyCellSx = {
  fontSize: 14,
  color: INK_BODY,
  borderBottomColor: "rgba(17, 24, 39, 0.05)",
  py: 1.75,
};

const rowSx = {
  transition: "background-color 200ms ease",

  "&:hover": {
    bgcolor: "rgba(16, 122, 100, 0.04)",
  },

  "&:last-of-type td": {
    borderBottom: 0,
  },
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    bgcolor: "#ffffff",

    "& fieldset": {
      borderColor: "rgba(17, 24, 39, 0.10)",
    },

    "&:hover fieldset": {
      borderColor: "rgba(16, 122, 100, 0.35)",
    },

    "&.Mui-focused fieldset": {
      borderColor: BRAND,
      borderWidth: 1,
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND,
  },
};

// =================================================
// STATIC OPTIONS
// =================================================

const VISA_OPTIONS = [
  {
    value: "student",
    label: "Student",
  },
  {
    value: "dependent",
    label: "Dependent",
  },
  {
    value: "designatedActivitiesJobHunting",
    label: "Designated Activities - Job Hunting",
  },
  {
    value: "designatedActivities",
    label: "Designated Activities",
  },
  {
    value: "engineerHumanitiesInternationalServices",
    label: "Engineer / Humanities / International Services",
  },
  {
    value: "specifiedSkilledWorker1",
    label: "Specified Skilled Worker 1",
  },
  {
    value: "specifiedSkilledWorker2",
    label: "Specified Skilled Worker 2",
  },
  {
    value: "skilledLabor",
    label: "Skilled Labor",
  },
  {
    value: "technicalInternTraining",
    label: "Technical Intern Training",
  },
  {
    value: "intra-companyTransferee",
    label: "Intra-company Transferee",
  },
  {
    value: "nursingCare",
    label: "Nursing Care",
  },
  {
    value: "highlySkilledProfessional",
    label: "Highly Skilled Professional",
  },
  {
    value: "businessManager",
    label: "Business Manager",
  },
  {
    value: "permanentResident",
    label: "Permanent Resident",
  },
  {
    value: "spouseChildOfJapaneseNational",
    label: "Spouse / Child of Japanese National",
  },
  {
    value: "spouseChildOfPermanentResident",
    label: "Spouse / Child of Permanent Resident",
  },
  {
    value: "longTermResident",
    label: "Long Term Resident",
  },
  {
    value: "other",
    label: "Other",
  },
];

const CATEGORY_OPTIONS = [
  {
    value: "newJob",
    label: "New Job",
  },
  {
    value: "jobChange",
    label: "Job Change",
  },
  {
    value: "dependentVisaRenewal",
    label: "Dependent Visa Renewal",
  },
  {
    value: "visaServiceOnlyRenewal",
    label: "Visa Service - Renewal",
  },
  {
    value: "visaServiceOnlyChange",
    label: "Visa Service - Change",
  },
  {
    value: "otherVisaService",
    label: "Other Visa Service",
  },
];

const PAYMENT_STATUS_OPTIONS = ["Completed", "Cancelled", "Refunded"];

const PAYMENT_METHOD_OPTIONS = [
  "Cash",
  "Bank Transfer",
  "Online Payment",
  "Cheque",
  "Other",
];

// =================================================
// FORMATTERS
// =================================================

const formatAmount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(Number(value || 0));

const formatJapanDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

// =================================================
// STATUS
// =================================================

const getStatusColor = (
  status: DashboardPerformanceStatus,
): "default" | "info" | "warning" | "success" => {
  switch (status) {
    case "Achieved":
      return "success";

    case "In Progress":
      return "warning";

    case "No Target":
      return "info";

    default:
      return "default";
  }
};

const getPaymentStatusColor = (
  status: DashboardPaymentStatus,
): "default" | "success" | "warning" | "error" => {
  if (status === "Completed") {
    return "success";
  }

  if (status === "Refunded") {
    return "warning";
  }

  if (status === "Cancelled") {
    return "error";
  }

  return "default";
};

// =================================================
// SUMMARY
// =================================================

type SummaryCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
};

function SummaryCard({ label, value, subtitle, icon }: SummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...softCard,
        height: "100%",

        transition: "transform 400ms ease, box-shadow 400ms ease",

        "&:hover": {
          transform: "translateY(-2px)",

          boxShadow:
            "0 1px 2px rgba(17,24,39,0.04), 0 18px 40px -24px rgba(17,24,39,0.38)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography sx={labelSx}>{label}</Typography>

          <Typography sx={valueSx}>{value}</Typography>

          {subtitle && (
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12,
                color: INK_MUTED,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: 2.5,
            bgcolor: BRAND_SOFT,
            color: BRAND,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

// =================================================
// STAT
// =================================================

type StatProps = {
  label: string;
  value: string;
  color?: string;
};

function Stat({ label, value, color }: StatProps) {
  return (
    <Box
      sx={{
        flex: "1 1 160px",
        minWidth: 140,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          color: INK_MUTED,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: 18,
          fontWeight: 600,
          color: color || INK,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// =================================================
// FILTER AUTOCOMPLETE
// =================================================

type FilterOption = {
  value: string;
  label: string;
};

type FilterAutocompleteProps = {
  label: string;

  value: string;

  onChange: (value: string) => void;

  options: FilterOption[];

  allLabel?: string;

  disabled?: boolean;
};

function FilterAutocomplete({
  label,
  value,
  onChange,
  options,
  allLabel = "All",
  disabled = false,
}: FilterAutocompleteProps) {
  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  return (
    <Autocomplete
      fullWidth
      autoHighlight
      clearOnEscape
      disabled={disabled}
      options={options}
      value={selectedOption}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selected) =>
        option.value === selected.value
      }
      onChange={(_event, option) => {
        onChange(option?.value ?? "");
      }}
      noOptionsText="No options found"
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;

        return (
          <Box
            component="li"
            key={key}
            {...optionProps}
            sx={{
              fontSize: 14,
            }}
          >
            {option.label}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label={label}
          placeholder={allLabel}
          sx={fieldSx}
        />
      )}
      sx={{
        "& .MuiAutocomplete-inputRoot": {
          bgcolor: "#ffffff",
        },
      }}
    />
  );
}

// =================================================
// COMPONENT
// =================================================

export default function AdminDashboard() {
  const t = useTranslations("adminDashboard");

  const {
    selectedMonth,
    handleMonthChange,

    filters,

    searchInput,
    setSearchInput,

    handleFilterChange,
    handleSearchSubmit,
    handleResetFilters,

    hasActiveFilters,

    overview,

    rankings,
    rankingPagination,

    stageBreakdown,

    payments,
    paymentPagination,

    filterOptions,

    isLoading,
    isFetching,

    loadError,

    handleRankingPageChange,
    handleRankingLimitChange,

    handlePaymentPageChange,
    handlePaymentLimitChange,

    handleStaffClick,
    handleClientClick,
  } = useAdminDashboard();

  if (isLoading || !overview) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          bgcolor: "#F7F8F6",
        }}
      >
        <CircularProgress
          size={28}
          sx={{
            color: BRAND,
          }}
        />
      </Box>
    );
  }

  const targetProgress = Math.min(Math.max(overview.targetAchievement, 0), 100);

  const performanceStatusLabel: Record<DashboardPerformanceStatus, string> = {
    "No Target": t("status.noTarget"),

    "Not Started": t("status.notStarted"),

    "In Progress": t("status.inProgress"),

    Achieved: t("status.achieved"),
  };

  // =================================================
  // FILTER OPTIONS
  // =================================================

  const stageOptions = filterOptions.stages.map((stage) => ({
    value: stage.key,

    label: stage.name,
  }));

  const staffOptions = filterOptions.staff.map((staff) => ({
    value: staff.staffId,

    label: `${staff.name} (${staff.staffId})${
      staff.isActive ? "" : " - Inactive"
    }`,
  }));

  const nationalityOptions = filterOptions.nationalities.map((nationality) => ({
    value: nationality,

    label: nationality,
  }));

  const japaneseLevelOptions = filterOptions.japaneseLevels.map((level) => ({
    value: level,

    label: level,
  }));

  const paymentStatusOptions = PAYMENT_STATUS_OPTIONS.map((status) => ({
    value: status,

    label: status,
  }));

  const paymentMethodOptions = PAYMENT_METHOD_OPTIONS.map((method) => ({
    value: method,

    label: method,
  }));

  return (
    <Box
      sx={{
        bgcolor: "#F7F8F6",

        minHeight: "100vh",

        px: {
          xs: 2,

          sm: 3,

          md: 4,
        },

        py: {
          xs: 3,

          md: 4,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 1320,

          mx: "auto",
        }}
      >
        {/* =================================================
        BREADCRUMB
        ================================================= */}

        <Box
          sx={{
            mb: 2,
          }}
        >
          <Breadcrumb
            items={[
              {
                label: t("dashboard"),

                current: true,
              },
            ]}
          />
        </Box>

        {/* =================================================
        HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            flexWrap: "wrap",

            alignItems: "flex-end",

            justifyContent: "space-between",

            gap: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 24,

                  md: 30,
                },

                fontWeight: 600,

                letterSpacing: -0.4,

                color: INK,
              }}
            >
              {t("title")}
            </Typography>

            <Typography
              sx={{
                mt: 1,

                fontSize: 14,

                color: INK_MUTED,
              }}
            >
              {t("description")}
            </Typography>
          </Box>

          <TextField
            type="month"
            size="small"
            label={t("performanceMonth")}
            value={selectedMonth}
            onChange={(event) => handleMonthChange(event.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            sx={{
              ...fieldSx,

              width: {
                xs: "100%",

                sm: 220,
              },
            }}
          />
        </Box>

        {loadError && (
          <Alert
            severity="error"
            sx={{
              mt: 2.5,

              borderRadius: 2.5,

              border: "1px solid rgba(211,47,47,0.14)",
            }}
          >
            {loadError}
          </Alert>
        )}

        {/* =================================================
        FILTERS
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            ...softCard,

            mt: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              flexWrap: "wrap",

              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1,
              }}
            >
              <TuneOutlinedIcon
                sx={{
                  color: BRAND,

                  fontSize: 21,
                }}
              />

              <Typography
                sx={{
                  fontSize: 17,

                  fontWeight: 600,

                  color: INK,
                }}
              >
                Dashboard Filters
              </Typography>
            </Box>

            <Button
              variant="text"
              startIcon={<RestartAltOutlinedIcon />}
              disabled={!hasActiveFilters && !searchInput}
              onClick={handleResetFilters}
              sx={{
                color: BRAND,

                textTransform: "none",
              }}
            >
              Reset Filters
            </Button>
          </Box>

          {/* =================================================
          SEARCH
          ================================================= */}

          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              mt: 2,

              display: "flex",

              flexDirection: {
                xs: "column",

                sm: "row",
              },

              gap: 1.5,
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Search"
              placeholder="Client ID, name, phone, email, staff, stage..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              sx={fieldSx}
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchOutlinedIcon />}
              sx={{
                minWidth: 120,

                borderRadius: 2.5,

                bgcolor: BRAND,

                boxShadow: "none",

                textTransform: "none",

                "&:hover": {
                  bgcolor: BRAND,

                  boxShadow: "none",
                },
              }}
            >
              Search
            </Button>
          </Box>

          {/* =================================================
          AUTOCOMPLETE FILTERS
          ================================================= */}

          <Box
            sx={{
              mt: 2,

              display: "grid",

              gap: 1.5,

              gridTemplateColumns: {
                xs: "1fr",

                sm: "repeat(2, minmax(0, 1fr))",

                md: "repeat(3, minmax(0, 1fr))",

                xl: "repeat(4, minmax(0, 1fr))",
              },
            }}
          >
            <FilterAutocomplete
              label="Assigned Staff"
              value={filters.staffId}
              onChange={(value) => handleFilterChange("staffId", value)}
              options={staffOptions}
              allLabel="All Staff"
            />

            <FilterAutocomplete
              label="Current Stage"
              value={filters.currentStage}
              onChange={(value) => handleFilterChange("currentStage", value)}
              options={stageOptions}
              allLabel="All Stages"
            />

            <FilterAutocomplete
              label="Visa Status"
              value={filters.currentVisaStatus}
              onChange={(value) =>
                handleFilterChange("currentVisaStatus", value)
              }
              options={VISA_OPTIONS}
              allLabel="All Visa Types"
            />

            <FilterAutocomplete
              label="Preferred Category"
              value={filters.preferCategory}
              onChange={(value) => handleFilterChange("preferCategory", value)}
              options={CATEGORY_OPTIONS}
              allLabel="All Categories"
            />

            <FilterAutocomplete
              label="Nationality"
              value={filters.nationality}
              onChange={(value) => handleFilterChange("nationality", value)}
              options={nationalityOptions}
              allLabel="All Nationalities"
            />

            <FilterAutocomplete
              label="Japanese Level"
              value={filters.japaneseLevel}
              onChange={(value) => handleFilterChange("japaneseLevel", value)}
              options={japaneseLevelOptions}
              allLabel="All Levels"
            />

            <FilterAutocomplete
              label="Payment Status"
              value={filters.paymentStatus}
              onChange={(value) => handleFilterChange("paymentStatus", value)}
              options={paymentStatusOptions}
              allLabel="All Payment Statuses"
            />

            <FilterAutocomplete
              label="Payment Method"
              value={filters.paymentMethod}
              onChange={(value) => handleFilterChange("paymentMethod", value)}
              options={paymentMethodOptions}
              allLabel="All Payment Methods"
            />

            <FilterAutocomplete
              label="Payment Stage"
              value={filters.paymentStage}
              onChange={(value) => handleFilterChange("paymentStage", value)}
              options={stageOptions}
              allLabel="All Payment Stages"
            />
          </Box>

          {isFetching && (
            <Typography
              sx={{
                mt: 1.5,

                fontSize: 12,

                color: INK_MUTED,
              }}
            >
              Updating dashboard...
            </Typography>
          )}
        </Paper>

        {/* =================================================
        SUMMARY
        ================================================= */}

        <Box
          sx={{
            mt: 2,

            display: "grid",

            gap: 2,

            gridTemplateColumns: {
              xs: "1fr",

              sm: "repeat(2, 1fr)",

              xl: "repeat(4, 1fr)",
            },
          }}
        >
          <SummaryCard
            label={t("totalClients")}
            value={String(overview.totalClients)}
            subtitle={`${overview.monthlyClientCount} paying clients in selected month`}
            icon={<PeopleAltOutlinedIcon fontSize="small" />}
          />

          <SummaryCard
            label={t("activeStaff")}
            value={String(overview.activeStaff)}
            subtitle={`${overview.totalStaff} total staff`}
            icon={<BadgeOutlinedIcon fontSize="small" />}
          />

          <SummaryCard
            label="Collected This Month"
            value={`¥${formatAmount(overview.monthlyCollected)}`}
            subtitle={`${overview.monthlyPaymentCount} completed payments`}
            icon={<PaymentsOutlinedIcon fontSize="small" />}
          />

          <SummaryCard
            label="Total Collected"
            value={`¥${formatAmount(overview.totalCollectedAllTime)}`}
            subtitle={`${overview.totalCompletedPayments} completed payments · ${overview.totalPayingClients} clients`}
            icon={<AccountBalanceWalletOutlinedIcon fontSize="small" />}
          />
        </Box>

        {/* =================================================
        MONTHLY TARGET
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            ...softCard,

            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              gap: 2,

              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 17,

                  fontWeight: 600,

                  color: INK,
                }}
              >
                {t("monthlyCollectionTarget")}
              </Typography>

              <Typography
                sx={{
                  mt: 0.25,

                  fontSize: 12,

                  color: INK_MUTED,
                }}
              >
                {selectedMonth}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",

                placeItems: "center",

                width: 38,

                height: 38,

                borderRadius: 2.5,

                bgcolor: BRAND_SOFT,

                color: BRAND,
              }}
            >
              <TrackChangesOutlinedIcon fontSize="small" />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,

              display: "flex",

              flexWrap: "wrap",

              gap: 2.5,
            }}
          >
            <Stat
              label={t("totalTarget")}
              value={`¥${formatAmount(overview.totalTarget)}`}
            />

            <Stat
              label={t("collected")}
              value={`¥${formatAmount(overview.monthlyCollected)}`}
              color={BRAND}
            />

            <Stat
              label={t("achievement")}
              value={`${overview.targetAchievement}%`}
            />
          </Box>

          <LinearProgress
            variant="determinate"
            value={targetProgress}
            sx={{
              mt: 3,

              height: 10,

              borderRadius: 999,

              bgcolor: "rgba(17, 24, 39, 0.06)",

              "& .MuiLinearProgress-bar": {
                borderRadius: 999,

                backgroundImage: `linear-gradient(90deg, #6FBFA6, ${BRAND})`,

                transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
              },
            }}
          />
        </Paper>

        {/* =================================================
        STAFF RANKING
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            ...softCard,

            mt: 2,

            p: 0,

            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: {
                xs: 2.5,

                md: 3,
              },

              py: 2,

              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            <Typography
              sx={{
                fontSize: 17,

                fontWeight: 600,

                color: INK,
              }}
            >
              {t("staffRanking")}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,

                fontSize: 12,

                color: INK_MUTED,
              }}
            >
              {t("staffRankingDescription")}
            </Typography>
          </Box>

          <TableContainer>
            <Table
              sx={{
                minWidth: 900,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      ...headCellSx,

                      pl: {
                        xs: 2.5,

                        md: 3,
                      },
                    }}
                  >
                    {t("rank")}
                  </TableCell>

                  <TableCell sx={headCellSx}>{t("staff")}</TableCell>

                  <TableCell sx={headCellSx} align="right">
                    {t("target")}
                  </TableCell>

                  <TableCell sx={headCellSx} align="right">
                    {t("collected")}
                  </TableCell>

                  <TableCell sx={headCellSx} align="right">
                    Target Remaining
                  </TableCell>

                  <TableCell sx={headCellSx} align="right">
                    {t("achievement")}
                  </TableCell>

                  <TableCell sx={headCellSx} align="center">
                    {t("paymentsHeader")}
                  </TableCell>

                  <TableCell sx={headCellSx} align="center">
                    {t("clients")}
                  </TableCell>

                  <TableCell
                    sx={{
                      ...headCellSx,

                      pr: {
                        xs: 2.5,

                        md: 3,
                      },
                    }}
                  >
                    {t("statusHeader")}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rankings.map((staff) => (
                  <TableRow
                    key={staff.staffId}
                    hover={false}
                    sx={{
                      ...rowSx,

                      cursor: "pointer",
                    }}
                    onClick={() => handleStaffClick(staff.staffId)}
                  >
                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        pl: {
                          xs: 2.5,

                          md: 3,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,

                          fontWeight: 700,

                          color: INK,
                        }}
                      >
                        #{staff.rank}
                      </Typography>
                    </TableCell>

                    <TableCell sx={bodyCellSx}>
                      <Typography
                        sx={{
                          fontSize: 14,

                          fontWeight: 600,

                          color: INK,
                        }}
                      >
                        {staff.staffName}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,

                          color: INK_MUTED,
                        }}
                      >
                        {staff.staffId}
                      </Typography>
                    </TableCell>

                    <TableCell sx={bodyCellSx} align="right">
                      ¥{formatAmount(staff.targetAmount)}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        fontWeight: 600,

                        color: BRAND,
                      }}
                      align="right"
                    >
                      ¥{formatAmount(staff.totalCollected)}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        color: INK_MUTED,
                      }}
                      align="right"
                    >
                      ¥{formatAmount(staff.remainingAmount)}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        fontWeight: 600,
                      }}
                      align="right"
                    >
                      {staff.achievementPercentage}%
                    </TableCell>

                    <TableCell sx={bodyCellSx} align="center">
                      {staff.paymentCount}
                    </TableCell>

                    <TableCell sx={bodyCellSx} align="center">
                      {staff.clientCount}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        pr: {
                          xs: 2.5,

                          md: 3,
                        },
                      }}
                    >
                      <Chip
                        size="small"
                        label={performanceStatusLabel[staff.status]}
                        color={getStatusColor(staff.status)}
                        variant="outlined"
                        sx={{
                          borderRadius: 999,

                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {rankings.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      sx={{
                        ...bodyCellSx,

                        py: 5,

                        color: INK_MUTED,

                        borderBottom: 0,
                      }}
                    >
                      No staff performance data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={rankingPagination.total}
            page={Math.max(rankingPagination.currentPage - 1, 0)}
            rowsPerPage={rankingPagination.perPage}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={(_, page) => handleRankingPageChange(page + 1)}
            onRowsPerPageChange={(event) =>
              handleRankingLimitChange(Number(event.target.value))
            }
            sx={{
              borderTop: `1px solid ${HAIRLINE}`,
            }}
          />
        </Paper>

        {/* =================================================
        BOTTOM
        ================================================= */}

        <Box
          sx={{
            mt: 2,

            display: "grid",

            gap: 2,

            gridTemplateColumns: {
              xs: "1fr",

              xl: "1fr 1.8fr",
            },

            alignItems: "start",
          }}
        >
          {/* =================================================
          CLIENT PROGRESS
          ================================================= */}

          <Paper elevation={0} sx={softCard}>
            <Typography
              sx={{
                fontSize: 17,

                fontWeight: 600,

                color: INK,
              }}
            >
              {t("clientProgress")}
            </Typography>

            {stageBreakdown.length === 0 ? (
              <Typography
                sx={{
                  mt: 2,

                  fontSize: 14,

                  color: INK_MUTED,
                }}
              >
                {t("noClientData")}
              </Typography>
            ) : (
              <Box
                sx={{
                  mt: 2,

                  display: "flex",

                  flexDirection: "column",

                  gap: 1.25,
                }}
              >
                {stageBreakdown.map((item) => (
                  <Box
                    key={item.stage || item.stageName}
                    sx={{
                      display: "flex",

                      alignItems: "center",

                      justifyContent: "space-between",

                      gap: 1.5,

                      px: 2,

                      py: 1.25,

                      borderRadius: 2,

                      bgcolor: "rgba(16, 122, 100, 0.05)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,

                        color: INK_BODY,
                      }}
                    >
                      {item.stageName}
                    </Typography>

                    <Typography
                      sx={{
                        px: 1.25,

                        py: 0.25,

                        borderRadius: 999,

                        bgcolor: "#ffffff",

                        fontSize: 13,

                        fontWeight: 600,

                        color: BRAND,
                      }}
                    >
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* =================================================
          PAYMENTS
          ================================================= */}

          <Paper
            elevation={0}
            sx={{
              ...softCard,

              p: 0,

              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: {
                  xs: 2.5,

                  md: 3,
                },

                py: 2,

                borderBottom: `1px solid ${HAIRLINE}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: 17,

                  fontWeight: 600,

                  color: INK,
                }}
              >
                Payments
              </Typography>

              <Typography
                sx={{
                  mt: 0.25,

                  fontSize: 12,

                  color: INK_MUTED,
                }}
              >
                Payments for {selectedMonth}
              </Typography>
            </Box>

            <TableContainer>
              <Table
                size="small"
                sx={{
                  minWidth: 980,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        ...headCellSx,

                        pl: {
                          xs: 2.5,

                          md: 3,
                        },
                      }}
                    >
                      Client
                    </TableCell>

                    <TableCell sx={headCellSx}>Stage</TableCell>

                    <TableCell sx={headCellSx} align="right">
                      Amount
                    </TableCell>

                    <TableCell sx={headCellSx}>Method</TableCell>

                    <TableCell sx={headCellSx}>Status</TableCell>

                    <TableCell sx={headCellSx}>Staff</TableCell>

                    <TableCell
                      sx={{
                        ...headCellSx,

                        pr: {
                          xs: 2.5,

                          md: 3,
                        },
                      }}
                    >
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment._id} hover={false} sx={rowSx}>
                      <TableCell
                        sx={{
                          ...bodyCellSx,

                          pl: {
                            xs: 2.5,

                            md: 3,
                          },
                        }}
                      >
                        <Typography
                          component="span"
                          onClick={() => handleClientClick(payment.clientId)}
                          sx={{
                            fontSize: 14,

                            fontWeight: 600,

                            color: BRAND,

                            cursor: "pointer",

                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {payment.clientId}
                        </Typography>

                        {payment.clientName && (
                          <Typography
                            sx={{
                              mt: 0.25,

                              fontSize: 12,

                              color: INK_MUTED,
                            }}
                          >
                            {payment.clientName}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell sx={bodyCellSx}>{payment.stageName}</TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          ...bodyCellSx,

                          fontWeight: 600,
                        }}
                      >
                        ¥{formatAmount(payment.amountPaid)}
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        {payment.paymentMethod}
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Chip
                          size="small"
                          label={payment.paymentStatus}
                          color={getPaymentStatusColor(payment.paymentStatus)}
                          variant="outlined"
                          sx={{
                            borderRadius: 999,

                            fontWeight: 500,
                          }}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          ...bodyCellSx,

                          color: INK_MUTED,
                        }}
                      >
                        {payment.creditedStaffName}

                        <Typography
                          sx={{
                            fontSize: 11,

                            color: INK_MUTED,
                          }}
                        >
                          {payment.creditedStaff}
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          ...bodyCellSx,

                          pr: {
                            xs: 2.5,

                            md: 3,
                          },

                          color: INK_MUTED,

                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatJapanDate(payment.paymentDate)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                        sx={{
                          ...bodyCellSx,

                          py: 5,

                          color: INK_MUTED,

                          borderBottom: 0,
                        }}
                      >
                        No payments found for the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={paymentPagination.total}
              page={Math.max(paymentPagination.currentPage - 1, 0)}
              rowsPerPage={paymentPagination.perPage}
              rowsPerPageOptions={[10, 25, 50]}
              onPageChange={(_, page) => handlePaymentPageChange(page + 1)}
              onRowsPerPageChange={(event) =>
                handlePaymentLimitChange(Number(event.target.value))
              }
              sx={{
                borderTop: `1px solid ${HAIRLINE}`,
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
