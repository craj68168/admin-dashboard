"use client";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import type { useAdminDashboard } from "./hook";
import type { DashboardFilters } from "./type";
type Props = {
  showFilters: boolean;
  onToggleFilters: () => void;
  data: Pick<
    ReturnType<typeof useAdminDashboard>,
    | "filters"
    | "searchInput"
    | "setSearchInput"
    | "handleFilterChange"
    | "handleSearchSubmit"
    | "handleResetFilters"
    | "hasActiveFilters"
    | "filterOptions"
    | "isFetching"
  >;
};
const BRAND = "#107A64";
const BRAND_DEEP = "#0A5A49";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_LINE = "rgba(16, 122, 100, 0.20)";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const INK = "#0F172A";
const INK_MUTED = "#5B6A7E";
const RADIUS = 20;
const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
  },
};
const softCard = {
  p: {
    xs: 2,
    sm: 2.5,
    md: 3,
  },
  borderRadius: `${RADIUS}px`,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(15,23,42,0.03), 0 18px 40px -28px rgba(15,23,42,0.30)",
};
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: `${RADIUS - 4}px`,
    bgcolor: "#ffffff",
    "& fieldset": {
      borderColor: "rgba(17, 24, 39, 0.12)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(16, 122, 100, 0.40)",
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
const VISA_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "dependent", label: "Dependent" },
  {
    value: "designatedActivitiesJobHunting",
    label: "Designated Activities - Job Hunting",
  },
  { value: "designatedActivities", label: "Designated Activities" },
  {
    value: "engineerHumanitiesInternationalServices",
    label: "Engineer / Humanities / International Services",
  },
  { value: "specifiedSkilledWorker1", label: "Specified Skilled Worker 1" },
  { value: "specifiedSkilledWorker2", label: "Specified Skilled Worker 2" },
  { value: "skilledLabor", label: "Skilled Labor" },
  { value: "technicalInternTraining", label: "Technical Intern Training" },
  { value: "intra-companyTransferee", label: "Intra-company Transferee" },
  { value: "nursingCare", label: "Nursing Care" },
  { value: "highlySkilledProfessional", label: "Highly Skilled Professional" },
  { value: "businessManager", label: "Business Manager" },
  { value: "permanentResident", label: "Permanent Resident" },
  {
    value: "spouseChildOfJapaneseNational",
    label: "Spouse / Child of Japanese National",
  },
  {
    value: "spouseChildOfPermanentResident",
    label: "Spouse / Child of Permanent Resident",
  },
  { value: "longTermResident", label: "Long Term Resident" },
  { value: "other", label: "Other" },
];
const CATEGORY_OPTIONS = [
  { value: "newJob", label: "New Job" },
  { value: "jobChange", label: "Job Change" },
  { value: "dependentVisaRenewal", label: "Dependent Visa Renewal" },
  { value: "visaServiceOnlyRenewal", label: "Visa Service - Renewal" },
  { value: "visaServiceOnlyChange", label: "Visa Service - Change" },
  { value: "otherVisaService", label: "Other Visa Service" },
];
const PAYMENT_STATUS_OPTIONS = ["Completed", "Cancelled", "Refunded"];
const PAYMENT_METHOD_OPTIONS = [
  "Cash",
  "Bank Transfer",
  "Online Payment",
  "Cheque",
  "Other",
];
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
export default function DashboardFilters({
  data,
  showFilters,
  onToggleFilters,
}: Props) {
  const {
    filters,
    searchInput,
    setSearchInput,
    handleFilterChange,
    handleSearchSubmit,
    handleResetFilters,
    hasActiveFilters,
    filterOptions,
    isFetching,
  } = data;
  const stageOptions = filterOptions.stages.map((stage) => ({
    value: stage.key,
    label: stage.name,
  }));
  const staffOptions = filterOptions.staff.map((staff) => ({
    value: staff.staffId,
    label: `${staff.name} (${staff.staffId})${staff.isActive ? "" : " - Inactive"}`,
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
  // =================================================
  // ACTIVE FILTER CHIPS
  // =================================================
  const stageNameOf = (key: string) =>
    filterOptions.stages.find((stage) => stage.key === key)?.name || key;
  const staffNameOf = (id: string) => {
    const staff = filterOptions.staff.find((item) => item.staffId === id);
    return staff ? `${staff.name} (${staff.staffId})` : id;
  };
  const activeChips: {
    key: keyof DashboardFilters;
    label: string;
    value: string;
  }[] = [];
  if (filters.staffId) {
    activeChips.push({
      key: "staffId",
      label: "Staff",
      value: staffNameOf(filters.staffId),
    });
  }
  if (filters.currentStage) {
    activeChips.push({
      key: "currentStage",
      label: "Stage",
      value: stageNameOf(filters.currentStage),
    });
  }
  if (filters.currentVisaStatus) {
    activeChips.push({
      key: "currentVisaStatus",
      label: "Visa",
      value:
        VISA_OPTIONS.find(
          (option) => option.value === filters.currentVisaStatus,
        )?.label || filters.currentVisaStatus,
    });
  }
  if (filters.preferCategory) {
    activeChips.push({
      key: "preferCategory",
      label: "Category",
      value:
        CATEGORY_OPTIONS.find(
          (option) => option.value === filters.preferCategory,
        )?.label || filters.preferCategory,
    });
  }
  if (filters.nationality) {
    activeChips.push({
      key: "nationality",
      label: "Nationality",
      value: filters.nationality,
    });
  }
  if (filters.japaneseLevel) {
    activeChips.push({
      key: "japaneseLevel",
      label: "Japanese",
      value: filters.japaneseLevel,
    });
  }
  if (filters.paymentStatus) {
    activeChips.push({
      key: "paymentStatus",
      label: "Payment status",
      value: filters.paymentStatus,
    });
  }
  if (filters.paymentMethod) {
    activeChips.push({
      key: "paymentMethod",
      label: "Payment method",
      value: filters.paymentMethod,
    });
  }
  if (filters.paymentStage) {
    activeChips.push({
      key: "paymentStage",
      label: "Payment stage",
      value: stageNameOf(filters.paymentStage),
    });
  }
  const activeFilterCount = activeChips.length;
  const canReset = hasActiveFilters || Boolean(searchInput);
  return (
    <Paper
      elevation={0}
      sx={{
        ...softCard,
        mt: 3,
        p: 0,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          pr: { xs: 1, md: 2 },
          bgcolor: showFilters ? "rgba(16, 122, 100, 0.04)" : "#ffffff",
          transition: "background-color 240ms ease",
          "&:hover": {
            bgcolor: "rgba(16, 122, 100, 0.06)",
          },
        }}
      >
        <ButtonBase
          onClick={onToggleFilters}
          aria-expanded={showFilters}
          aria-controls="dashboard-filters-panel"
          sx={{
            flex: 1,
            minWidth: 0,
            px: { xs: 2, sm: 2.5, md: 3 },
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            textAlign: "left",
            borderRadius: 0,
            ...focusRing,
            "&:focus-visible": {
              outline: `2px solid ${BRAND}`,
              outlineOffset: -2,
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              minWidth: 0,
            }}
          >

            <Typography
              component="span"
              sx={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: -0.2,
                color: INK,
              }}
            >
              Dashboard Filters
            </Typography>

            {activeFilterCount > 0 && (
              <Box
                component="span"
                aria-label={`${activeFilterCount} active filters`}
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 999,
                  bgcolor: BRAND,
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                {activeFilterCount}
              </Box>
            )}
          </Box>

          <Box
            component="span"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: BRAND,
              flexShrink: 0,
            }}
          >
            <Typography
              component="span"
              sx={{
                display: { xs: "none", sm: "inline" },
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {showFilters ? "Hide filters" : "Show filters"}
            </Typography>

            <ExpandMoreOutlinedIcon
              sx={{
                fontSize: 22,
                transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 300ms ease",
              }}
            />
          </Box>
        </ButtonBase>

        {canReset && (
          <Button
            variant="text"
            size="small"
            startIcon={<RestartAltOutlinedIcon />}
            onClick={handleResetFilters}
            sx={{
              flexShrink: 0,
              color: BRAND,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 999,
              "&:hover": {
                bgcolor: BRAND_SOFT,
              },
            }}
          >
            Reset
          </Button>
        )}
      </Box>

      <Collapse in={showFilters} unmountOnExit id="dashboard-filters-panel">
        <Box
          sx={{
            px: { xs: 2, sm: 2.5, md: 3 },
            pb: { xs: 2, md: 3 },
            borderTop: `1px solid ${HAIRLINE}`,
            pt: 2.5,
          }}
        >
          {/* =================================================
        SEARCH
        ================================================= */}

          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
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
                height: 40,
                flexShrink: 0,
                borderRadius: `${RADIUS - 4}px`,
                bgcolor: BRAND,
                boxShadow: "none",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: BRAND_DEEP,
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

          <Typography
            role="status"
            sx={{
              mt: 2,
              fontSize: 12,
              color: INK_MUTED,
            }}
          >
            {isFetching
              ? "Updating dashboard..."
              : "Collections include completed payments only. Payment status filters the payment table; client stages show the current snapshot."}
          </Typography>
        </Box>
      </Collapse>

      {!showFilters && activeFilterCount > 0 && (
        <Box
          sx={{
            px: { xs: 2, sm: 2.5, md: 3 },
            py: 1.75,
            borderTop: `1px solid ${HAIRLINE}`,
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {activeChips.map((chip) => (
            <Box
              key={chip.key}
              component="button"
              type="button"
              aria-label={`Remove ${chip.label} filter: ${chip.value}`}
              onClick={() => handleFilterChange(chip.key, "")}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                maxWidth: "100%",
                pl: 1.25,
                pr: 0.75,
                py: 0.5,
                font: "inherit",
                textAlign: "left",
                borderRadius: 999,
                bgcolor: "rgba(16, 122, 100, 0.07)",
                border: "1px solid",
                borderColor: BRAND_LINE,
                cursor: "pointer",
                transition: "background-color 200ms ease",
                "&:hover": {
                  bgcolor: "rgba(16, 122, 100, 0.14)",
                },
                ...focusRing,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: 12,
                  color: INK_MUTED,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {chip.label}
              </Typography>

              <Typography
                component="span"
                sx={{
                  fontSize: 12,
                  color: BRAND_DEEP,
                  fontWeight: 700,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {chip.value}
              </Typography>

              <CloseOutlinedIcon
                sx={{ fontSize: 14, color: INK_MUTED, flexShrink: 0 }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
