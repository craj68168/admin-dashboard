"use client";
import { useLocale } from "next-intl";
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
  allLabel,
  disabled = false,
}: FilterAutocompleteProps) {
  const lang = useLocale();
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
      noOptionsText={lang === "ja" ? "該当する項目はありません" : "No options found"}
      clearText={lang === "ja" ? "クリア" : "Clear"}
      openText={lang === "ja" ? "開く" : "Open"}
      closeText={lang === "ja" ? "閉じる" : "Close"}
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
          placeholder={allLabel ?? (lang === "ja" ? "すべて" : "All")}
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
  const lang = useLocale();
  const VISA_OPTIONS = [
    { value: "student", label: lang === "ja" ? "留学" : "Student" },
    { value: "dependent", label: lang === "ja" ? "家族滞在" : "Dependent" },
    {
      value: "designatedActivitiesJobHunting",
      label: lang === "ja" ? "特定活動（就職活動）" : "Designated Activities - Job Hunting",
    },
    { value: "designatedActivities", label: lang === "ja" ? "特定活動" : "Designated Activities" },
    {
      value: "engineerHumanitiesInternationalServices",
      label: lang === "ja" ? "技術・人文知識・国際業務" : "Engineer / Humanities / International Services",
    },
    { value: "specifiedSkilledWorker1", label: lang === "ja" ? "特定技能1号" : "Specified Skilled Worker 1" },
    { value: "specifiedSkilledWorker2", label: lang === "ja" ? "特定技能2号" : "Specified Skilled Worker 2" },
    { value: "skilledLabor", label: lang === "ja" ? "技能" : "Skilled Labor" },
    { value: "technicalInternTraining", label: lang === "ja" ? "技能実習" : "Technical Intern Training" },
    { value: "intra-companyTransferee", label: lang === "ja" ? "企業内転勤" : "Intra-company Transferee" },
    { value: "nursingCare", label: lang === "ja" ? "介護" : "Nursing Care" },
    { value: "highlySkilledProfessional", label: lang === "ja" ? "高度専門職" : "Highly Skilled Professional" },
    { value: "businessManager", label: lang === "ja" ? "経営・管理" : "Business Manager" },
    { value: "permanentResident", label: lang === "ja" ? "永住者" : "Permanent Resident" },
    {
      value: "spouseChildOfJapaneseNational",
      label: lang === "ja" ? "日本人の配偶者等" : "Spouse / Child of Japanese National",
    },
    {
      value: "spouseChildOfPermanentResident",
      label: lang === "ja" ? "永住者の配偶者等" : "Spouse / Child of Permanent Resident",
    },
    { value: "longTermResident", label: lang === "ja" ? "定住者" : "Long Term Resident" },
    { value: "other", label: lang === "ja" ? "その他" : "Other" },
  ];
  const CATEGORY_OPTIONS = [
    { value: "newJob", label: lang === "ja" ? "新規就職" : "New Job" },
    { value: "jobChange", label: lang === "ja" ? "転職" : "Job Change" },
    { value: "dependentVisaRenewal", label: lang === "ja" ? "家族滞在ビザ更新" : "Dependent Visa Renewal" },
    { value: "visaServiceOnlyRenewal", label: lang === "ja" ? "ビザサービス（更新）" : "Visa Service - Renewal" },
    { value: "visaServiceOnlyChange", label: lang === "ja" ? "ビザサービス（変更）" : "Visa Service - Change" },
    { value: "otherVisaService", label: lang === "ja" ? "その他のビザサービス" : "Other Visa Service" },
  ];

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
    label: `${staff.name} (${staff.staffId})${staff.isActive ? "" : (lang === "ja" ? " - 非アクティブ" : " - Inactive")}`,
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
    label: lang === "ja"
      ? status === "Completed" ? "完了" : status === "Cancelled" ? "キャンセル" : status === "Refunded" ? "返金済み" : status
      : status,
  }));
  const paymentMethodOptions = PAYMENT_METHOD_OPTIONS.map((method) => ({
    value: method,
    label: lang === "ja"
      ? method === "Cash" ? "現金" : method === "Bank Transfer" ? "銀行振込" : method === "Online Payment" ? "オンライン決済" : method === "Cheque" ? "小切手" : method === "Other" ? "その他" : method
      : method,
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
      label: lang === "ja" ? "スタッフ" : "Staff",
      value: staffNameOf(filters.staffId),
    });
  }
  if (filters.currentStage) {
    activeChips.push({
      key: "currentStage",
      label: lang === "ja" ? "ステージ" : "Stage",
      value: stageNameOf(filters.currentStage),
    });
  }
  if (filters.currentVisaStatus) {
    activeChips.push({
      key: "currentVisaStatus",
      label: lang === "ja" ? "ビザ" : "Visa",
      value:
        VISA_OPTIONS.find(
          (option) => option.value === filters.currentVisaStatus,
        )?.label || filters.currentVisaStatus,
    });
  }
  if (filters.preferCategory) {
    activeChips.push({
      key: "preferCategory",
      label: lang === "ja" ? "カテゴリー" : "Category",
      value:
        CATEGORY_OPTIONS.find(
          (option) => option.value === filters.preferCategory,
        )?.label || filters.preferCategory,
    });
  }
  if (filters.nationality) {
    activeChips.push({
      key: "nationality",
      label: lang === "ja" ? "国籍" : "Nationality",
      value: filters.nationality,
    });
  }
  if (filters.japaneseLevel) {
    activeChips.push({
      key: "japaneseLevel",
      label: lang === "ja" ? "日本語" : "Japanese",
      value: filters.japaneseLevel,
    });
  }
  if (filters.paymentStatus) {
    activeChips.push({
      key: "paymentStatus",
      label: lang === "ja" ? "入金ステータス" : "Payment status",
      value: paymentStatusOptions.find((option) => option.value === filters.paymentStatus)?.label || filters.paymentStatus,
    });
  }
  if (filters.paymentMethod) {
    activeChips.push({
      key: "paymentMethod",
      label: lang === "ja" ? "支払方法" : "Payment method",
      value: paymentMethodOptions.find((option) => option.value === filters.paymentMethod)?.label || filters.paymentMethod,
    });
  }
  if (filters.paymentStage) {
    activeChips.push({
      key: "paymentStage",
      label: lang === "ja" ? "入金ステージ" : "Payment stage",
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
          flexWrap: "wrap",
          justifyContent: "flex-end",
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
            flex: "1 1 220px",
            minWidth: 0,
            minHeight: 44,
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
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1.25,
              minWidth: 0,
            }}
          >

            <Typography
              component="span"
              sx={{
                fontSize: 16,
                overflowWrap: "anywhere",
                fontWeight: 700,
                letterSpacing: -0.2,
                color: INK,
              }}
            >
              {lang === "ja" ? "ダッシュボードの絞り込み" : "Dashboard Filters"}
            </Typography>

            {activeFilterCount > 0 && (
              <Box
                component="span"
                aria-label={lang === "ja" ? `${activeFilterCount}件のフィルターが適用中` : `${activeFilterCount} active filters`}
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
              {lang === "ja" ? (showFilters ? "フィルターを非表示" : "フィルターを表示") : (showFilters ? "Hide filters" : "Show filters")}
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
            {lang === "ja" ? "リセット" : "Reset"}
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
              label={lang === "ja" ? "検索" : "Search"}
              placeholder={lang === "ja" ? "顧客ID、氏名、電話番号、メール、スタッフ、ステージ…" : "Client ID, name, phone, email, staff, stage..."}
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
                width: { xs: "100%", sm: "auto" },
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
              {lang === "ja" ? "検索" : "Search"}
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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            }}
          >
            <FilterAutocomplete
              label={lang === "ja" ? "担当スタッフ" : "Assigned Staff"}
              value={filters.staffId}
              onChange={(value) => handleFilterChange("staffId", value)}
              options={staffOptions}
              allLabel={lang === "ja" ? "すべてのスタッフ" : "All Staff"}
            />

            <FilterAutocomplete
              label={lang === "ja" ? "現在のステージ" : "Current Stage"}
              value={filters.currentStage}
              onChange={(value) => handleFilterChange("currentStage", value)}
              options={stageOptions}
              allLabel={lang === "ja" ? "すべてのステージ" : "All Stages"}
            />

            <FilterAutocomplete
              label={lang === "ja" ? "在留資格" : "Visa Status"}
              value={filters.currentVisaStatus}
              onChange={(value) =>
                handleFilterChange("currentVisaStatus", value)
              }
              options={VISA_OPTIONS}
              allLabel={lang === "ja" ? "すべての在留資格" : "All Visa Types"}
            />

            <FilterAutocomplete
              label={lang === "ja" ? "希望カテゴリー" : "Preferred Category"}
              value={filters.preferCategory}
              onChange={(value) => handleFilterChange("preferCategory", value)}
              options={CATEGORY_OPTIONS}
              allLabel={lang === "ja" ? "すべてのカテゴリー" : "All Categories"}
            />

            <FilterAutocomplete
              label={lang === "ja" ? "国籍" : "Nationality"}
              value={filters.nationality}
              onChange={(value) => handleFilterChange("nationality", value)}
              options={nationalityOptions}
              allLabel={lang === "ja" ? "すべての国籍" : "All Nationalities"}
            />

            <FilterAutocomplete
              label={lang === "ja" ? "日本語レベル" : "Japanese Level"}
              value={filters.japaneseLevel}
              onChange={(value) => handleFilterChange("japaneseLevel", value)}
              options={japaneseLevelOptions}
              allLabel={lang === "ja" ? "すべてのレベル" : "All Levels"}
            />

            <FilterAutocomplete
              label={lang === "ja" ? "入金ステータス" : "Payment Status"}
              value={filters.paymentStatus}
              onChange={(value) => handleFilterChange("paymentStatus", value)}
              options={paymentStatusOptions}
              allLabel={lang === "ja" ? "すべての入金ステータス" : "All Payment Statuses"}
            />

            <FilterAutocomplete
              label={lang === "ja" ? "支払方法" : "Payment Method"}
              value={filters.paymentMethod}
              onChange={(value) => handleFilterChange("paymentMethod", value)}
              options={paymentMethodOptions}
              allLabel={lang === "ja" ? "すべての支払方法" : "All Payment Methods"}
            />

            <FilterAutocomplete
              label={lang === "ja" ? "入金ステージ" : "Payment Stage"}
              value={filters.paymentStage}
              onChange={(value) => handleFilterChange("paymentStage", value)}
              options={stageOptions}
              allLabel={lang === "ja" ? "すべての入金ステージ" : "All Payment Stages"}
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
              ? (lang === "ja" ? "ダッシュボードを更新中…" : "Updating dashboard...")
              : (lang === "ja" ? "入金額には完了済みの入金のみが含まれます。入金ステータスは入金一覧を絞り込み、顧客ステージは現在の状態を表示します。" : "Collections include completed payments only. Payment status filters the payment table; client stages show the current snapshot.")}
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
              aria-label={lang === "ja" ? `${chip.label}フィルターを解除：${chip.value}` : `Remove ${chip.label} filter: ${chip.value}`}
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
