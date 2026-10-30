"use client";
import { createTranslator, useLocale } from "next-intl";
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
import { NATIONALITIES, JAPANESE_LEVELS } from "@/components/constant";

const messages = {
  en: {
    legacyPayment: "Legacy Payment",
    nationalitynepali: "Nepali",
    nationalityindian: "Indian",
    nationalitypakistani: "Pakistani",
    nationalitybangladeshi: "Bangladeshi",
    nationalitysriLankan: "Sri Lankan",
    nationalityvietnamese: "Vietnamese",
    nationalitymyanmar: "Myanmar",
    nationalityindonesian: "Indonesian",
    nationalityfilipino: "Filipino",
    nationalitychinese: "Chinese",
    nationalityother: "Other",
    japaneseLeveln1: "N1",
    japaneseLeveln2: "N2",
    japaneseLeveln3: "N3",
    japaneseLeveln4: "N4",
    japaneseLeveln5: "N5",
    japaneseLevelnone: "No JLPT / None",
    noOptionsFound: "No options found",
    clear: "Clear",
    open: "Open",
    close: "Close",
    all: "All",
    student: "Student",
    dependent: "Dependent",
    designatedActivitiesJobHunting: "Designated Activities - Job Hunting",
    designatedActivities: "Designated Activities",
    engineerHumanitiesInternationalServices: "Engineer / Humanities / International Services",
    specifiedSkilledWorker2: "Specified Skilled Worker 2",
    skilledLabor: "Skilled Labor",
    technicalInternTraining: "Technical Intern Training",
    intraCompanyTransferee: "Intra-company Transferee",
    nursingCare: "Nursing Care",
    highlySkilledProfessional: "Highly Skilled Professional",
    businessManager: "Business Manager",
    permanentResident: "Permanent Resident",
    spouseChildOfJapaneseNational: "Spouse / Child of Japanese National",
    spouseChildOfPermanentResident: "Spouse / Child of Permanent Resident",
    longTermResident: "Long Term Resident",
    other: "Other",
    newJob: "New Job",
    jobChange: "Job Change",
    dependentVisaRenewal: "Dependent Visa Renewal",
    visaServiceRenewal: "Visa Service - Renewal",
    visaServiceChange: "Visa Service - Change",
    otherVisaService: "Other Visa Service",
    inactive: " - Inactive",
    staff: "Staff",
    stage: "Stage",
    visa: "Visa",
    category: "Category",
    nationality: "Nationality",
    japanese: "Japanese",
    paymentStatus: "Payment status",
    paymentMethod: "Payment method",
    paymentStage: "Payment stage",
    dashboardFilters: "Dashboard Filters",
    activeFilters: "{activeFilterCount} active filters",
    reset: "Reset",
    search: "Search",
    assignedStaff: "Assigned Staff",
    allStaff: "All Staff",
    currentStage: "Current Stage",
    allStages: "All Stages",
    visaStatus: "Visa Status",
    allVisaTypes: "All Visa Types",
    preferredCategory: "Preferred Category",
    allCategories: "All Categories",
    allNationalities: "All Nationalities",
    japaneseLevel: "Japanese Level",
    allLevels: "All Levels",
    allPaymentStatuses: "All Payment Statuses",
    allPaymentMethods: "All Payment Methods",
    allPaymentStages: "All Payment Stages",
    updatingDashboard: "Updating dashboard...",
    removeFilter: "Remove {label} filter: {value}",
    stageRegistrationPending: "Registration Pending",
    stageRegisteredVacancySearching: "Registered / Vacancy Searching",
    stageInterviewPreparation: "Interview Fixed / Preparation",
    stageInterviewFailed: "Interview Failed",
    stageJobOfferReceived: "Naitei / Job Offer Received",
    stageVisaDocumentsSubmitted: "Visa Documents Submitted",
    stageVisaResultWaiting: "Visa Applied / Result Waiting",
    stageVisaApproved: "Visa Approved",
    stageVisaRejected: "Visa Rejected",
    stageCompanyJoining: "Waiting for Nyusha / Company Joining",
    stageReturnToNepal: "Return to Nepal",
    statusCompleted: "Completed",
    statusCancelled: "Cancelled",
    statusRefunded: "Refunded",
    methodCash: "Cash",
    methodBankTransfer: "Bank Transfer",
    methodOnlinePayment: "Online Payment",
    methodCheque: "Cheque",
    methodOther: "Other",
    toggleFilters: "{showFilters, select, true {Hide filters} other {Show filters}}",
    searchPlaceholder: "Client ID, name, phone, email, staff, stage...",
    collectionScopeNote: "Collections include completed payments only. Payment status filters the payment table; client stages show the current snapshot.",
    paymentStatusField: "Payment Status",
    paymentMethodField: "Payment Method",
    paymentStageField: "Payment Stage",
    specifiedSkilledWorker1: "Specified Skilled Worker 1"
  },
  ja: {
    legacyPayment: "過去の入金",
    nationalitynepali: "ネパール",
    nationalityindian: "インド",
    nationalitypakistani: "パキスタン",
    nationalitybangladeshi: "バングラデシュ",
    nationalitysriLankan: "スリランカ",
    nationalityvietnamese: "ベトナム",
    nationalitymyanmar: "ミャンマー",
    nationalityindonesian: "インドネシア",
    nationalityfilipino: "フィリピン",
    nationalitychinese: "中国",
    nationalityother: "その他",
    japaneseLeveln1: "N1",
    japaneseLeveln2: "N2",
    japaneseLeveln3: "N3",
    japaneseLeveln4: "N4",
    japaneseLeveln5: "N5",
    japaneseLevelnone: "JLPTなし / 未取得",
    noOptionsFound: "該当する項目はありません",
    clear: "クリア",
    open: "開く",
    close: "閉じる",
    all: "すべて",
    student: "留学",
    dependent: "家族滞在",
    designatedActivitiesJobHunting: "特定活動（就職活動）",
    designatedActivities: "特定活動",
    engineerHumanitiesInternationalServices: "技術・人文知識・国際業務",
    specifiedSkilledWorker2: "特定技能2号",
    skilledLabor: "技能",
    technicalInternTraining: "技能実習",
    intraCompanyTransferee: "企業内転勤",
    nursingCare: "介護",
    highlySkilledProfessional: "高度専門職",
    businessManager: "経営・管理",
    permanentResident: "永住者",
    spouseChildOfJapaneseNational: "日本人の配偶者等",
    spouseChildOfPermanentResident: "永住者の配偶者等",
    longTermResident: "定住者",
    other: "その他",
    newJob: "新規就職",
    jobChange: "転職",
    dependentVisaRenewal: "家族滞在ビザ更新",
    visaServiceRenewal: "ビザサービス（更新）",
    visaServiceChange: "ビザサービス（変更）",
    otherVisaService: "その他のビザサービス",
    inactive: " - 非アクティブ",
    staff: "スタッフ",
    stage: "ステージ",
    visa: "ビザ",
    category: "カテゴリー",
    nationality: "国籍",
    japanese: "日本語",
    paymentStatus: "入金ステータス",
    paymentMethod: "支払方法",
    paymentStage: "入金ステージ",
    dashboardFilters: "ダッシュボードの絞り込み",
    activeFilters: "{activeFilterCount}件のフィルターが適用中",
    reset: "リセット",
    search: "検索",
    assignedStaff: "担当スタッフ",
    allStaff: "すべてのスタッフ",
    currentStage: "現在のステージ",
    allStages: "すべてのステージ",
    visaStatus: "在留資格",
    allVisaTypes: "すべての在留資格",
    preferredCategory: "希望カテゴリー",
    allCategories: "すべてのカテゴリー",
    allNationalities: "すべての国籍",
    japaneseLevel: "日本語レベル",
    allLevels: "すべてのレベル",
    allPaymentStatuses: "すべての入金ステータス",
    allPaymentMethods: "すべての支払方法",
    allPaymentStages: "すべての入金ステージ",
    updatingDashboard: "ダッシュボードを更新中…",
    removeFilter: "{label}フィルターを解除：{value}",
    stageRegistrationPending: "登録待ち",
    stageRegisteredVacancySearching: "登録済み / 求人検索中",
    stageInterviewPreparation: "面接確定 / 準備中",
    stageInterviewFailed: "面接不合格",
    stageJobOfferReceived: "内定 / オファー受領",
    stageVisaDocumentsSubmitted: "ビザ書類提出済み",
    stageVisaResultWaiting: "ビザ申請済み / 結果待ち",
    stageVisaApproved: "ビザ承認",
    stageVisaRejected: "ビザ却下",
    stageCompanyJoining: "入社待ち",
    stageReturnToNepal: "ネパールへ帰国",
    statusCompleted: "完了",
    statusCancelled: "キャンセル",
    statusRefunded: "返金済み",
    methodCash: "現金",
    methodBankTransfer: "銀行振込",
    methodOnlinePayment: "オンライン決済",
    methodCheque: "小切手",
    methodOther: "その他",
    toggleFilters: "{showFilters, select, true {フィルターを非表示} other {フィルターを表示}}",
    searchPlaceholder: "顧客ID、氏名、電話番号、メール、スタッフ、ステージ…",
    collectionScopeNote: "入金額には完了済みの入金のみが含まれます。入金ステータスは入金一覧を絞り込み、顧客ステージは現在の状態を表示します。",
    paymentStatusField: "入金ステータス",
    paymentMethodField: "支払方法",
    paymentStageField: "入金ステージ",
    specifiedSkilledWorker1: "特定技能1号"
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
}

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
  const t = useLocalTranslations();
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
      noOptionsText={t("noOptionsFound")}
      clearText={t("clear")}
      openText={t("open")}
      closeText={t("close")}
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
          placeholder={allLabel ?? (t("all"))}
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
  const t = useLocalTranslations();
  const VISA_OPTIONS = [
    { value: "student", label: t("student") },
    { value: "dependent", label: t("dependent") },
    {
      value: "designatedActivitiesJobHunting",
      label: t("designatedActivitiesJobHunting"),
    },
    { value: "designatedActivities", label: t("designatedActivities") },
    {
      value: "engineerHumanitiesInternationalServices",
      label: t("engineerHumanitiesInternationalServices"),
    },
    { value: "specifiedSkilledWorker1", label: t("specifiedSkilledWorker1") },
    { value: "specifiedSkilledWorker2", label: t("specifiedSkilledWorker2") },
    { value: "skilledLabor", label: t("skilledLabor") },
    { value: "technicalInternTraining", label: t("technicalInternTraining") },
    { value: "intra-companyTransferee", label: t("intraCompanyTransferee") },
    { value: "nursingCare", label: t("nursingCare") },
    { value: "highlySkilledProfessional", label: t("highlySkilledProfessional") },
    { value: "businessManager", label: t("businessManager") },
    { value: "permanentResident", label: t("permanentResident") },
    {
      value: "spouseChildOfJapaneseNational",
      label: t("spouseChildOfJapaneseNational"),
    },
    {
      value: "spouseChildOfPermanentResident",
      label: t("spouseChildOfPermanentResident"),
    },
    { value: "longTermResident", label: t("longTermResident") },
    { value: "other", label: t("other") },
  ];
  const CATEGORY_OPTIONS = [
    { value: "newJob", label: t("newJob") },
    { value: "jobChange", label: t("jobChange") },
    { value: "dependentVisaRenewal", label: t("dependentVisaRenewal") },
    { value: "visaServiceOnlyRenewal", label: t("visaServiceRenewal") },
    { value: "visaServiceOnlyChange", label: t("visaServiceChange") },
    { value: "otherVisaService", label: t("otherVisaService") },
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
  const nationalityLabel = (value: string) => {
    const option = NATIONALITIES.find((option) => option.value === value);
    return option ? t(`nationality${option.key}`) : value;
  };
  const japaneseLevelLabel = (value: string) => {
    const option = JAPANESE_LEVELS.find((option) => option.value === value);
    return option ? t(`japaneseLevel${option.key}`) : value;
  };
  const stageOptions = filterOptions.stages.map((stage) => ({
    value: stage.key,
    label: translateStage(stage.name, t),
  }));
  const staffOptions = filterOptions.staff.map((staff) => ({
    value: staff.staffId,
    label: `${staff.name} (${staff.staffId})${staff.isActive ? "" : t("inactive")}`,
  }));
  const nationalityOptions = filterOptions.nationalities.map((nationality) => ({
    value: nationality,
    label: nationalityLabel(nationality),
  }));
  const japaneseLevelOptions = filterOptions.japaneseLevels.map((level) => ({
    value: level,
    label: japaneseLevelLabel(level),
  }));
  const paymentStatusOptions = PAYMENT_STATUS_OPTIONS.map((status) => ({
    value: status,
    label: translatePaymentStatus(status, t),
  }));
  const paymentMethodOptions = PAYMENT_METHOD_OPTIONS.map((method) => ({
    value: method,
    label: translatePaymentMethod(method, t),
  }));
  // =================================================
  // ACTIVE FILTER CHIPS
  // =================================================
  const stageNameOf = (key: string) => {
    const name = filterOptions.stages.find((stage) => stage.key === key)?.name || key;
    return translateStage(name, t);
  };
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
      label: t("staff"),
      value: staffNameOf(filters.staffId),
    });
  }
  if (filters.currentStage) {
    activeChips.push({
      key: "currentStage",
      label: t("stage"),
      value: stageNameOf(filters.currentStage),
    });
  }
  if (filters.currentVisaStatus) {
    activeChips.push({
      key: "currentVisaStatus",
      label: t("visa"),
      value:
        VISA_OPTIONS.find(
          (option) => option.value === filters.currentVisaStatus,
        )?.label || filters.currentVisaStatus,
    });
  }
  if (filters.preferCategory) {
    activeChips.push({
      key: "preferCategory",
      label: t("category"),
      value:
        CATEGORY_OPTIONS.find(
          (option) => option.value === filters.preferCategory,
        )?.label || filters.preferCategory,
    });
  }
  if (filters.nationality) {
    activeChips.push({
      key: "nationality",
      label: t("nationality"),
      value: nationalityLabel(filters.nationality),
    });
  }
  if (filters.japaneseLevel) {
    activeChips.push({
      key: "japaneseLevel",
      label: t("japanese"),
      value: japaneseLevelLabel(filters.japaneseLevel),
    });
  }
  if (filters.paymentStatus) {
    activeChips.push({
      key: "paymentStatus",
      label: t("paymentStatus"),
      value: paymentStatusOptions.find((option) => option.value === filters.paymentStatus)?.label || filters.paymentStatus,
    });
  }
  if (filters.paymentMethod) {
    activeChips.push({
      key: "paymentMethod",
      label: t("paymentMethod"),
      value: paymentMethodOptions.find((option) => option.value === filters.paymentMethod)?.label || filters.paymentMethod,
    });
  }
  if (filters.paymentStage) {
    activeChips.push({
      key: "paymentStage",
      label: t("paymentStage"),
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
              {t("dashboardFilters")}
            </Typography>

            {activeFilterCount > 0 && (
              <Box
                component="span"
                aria-label={t("activeFilters", { activeFilterCount: activeFilterCount })}
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
              {t("toggleFilters", { showFilters: String(Boolean(showFilters)) })}
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
            {t("reset")}
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
              label={t("search")}
              placeholder={t("searchPlaceholder")}
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
              {t("search")}
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
              label={t("assignedStaff")}
              value={filters.staffId}
              onChange={(value) => handleFilterChange("staffId", value)}
              options={staffOptions}
              allLabel={t("allStaff")}
            />

            <FilterAutocomplete
              label={t("currentStage")}
              value={filters.currentStage}
              onChange={(value) => handleFilterChange("currentStage", value)}
              options={stageOptions}
              allLabel={t("allStages")}
            />

            <FilterAutocomplete
              label={t("visaStatus")}
              value={filters.currentVisaStatus}
              onChange={(value) =>
                handleFilterChange("currentVisaStatus", value)
              }
              options={VISA_OPTIONS}
              allLabel={t("allVisaTypes")}
            />

            <FilterAutocomplete
              label={t("preferredCategory")}
              value={filters.preferCategory}
              onChange={(value) => handleFilterChange("preferCategory", value)}
              options={CATEGORY_OPTIONS}
              allLabel={t("allCategories")}
            />

            <FilterAutocomplete
              label={t("nationality")}
              value={filters.nationality}
              onChange={(value) => handleFilterChange("nationality", value)}
              options={nationalityOptions}
              allLabel={t("allNationalities")}
            />

            <FilterAutocomplete
              label={t("japaneseLevel")}
              value={filters.japaneseLevel}
              onChange={(value) => handleFilterChange("japaneseLevel", value)}
              options={japaneseLevelOptions}
              allLabel={t("allLevels")}
            />

            <FilterAutocomplete
              label={t("paymentStatusField")}
              value={filters.paymentStatus}
              onChange={(value) => handleFilterChange("paymentStatus", value)}
              options={paymentStatusOptions}
              allLabel={t("allPaymentStatuses")}
            />

            <FilterAutocomplete
              label={t("paymentMethodField")}
              value={filters.paymentMethod}
              onChange={(value) => handleFilterChange("paymentMethod", value)}
              options={paymentMethodOptions}
              allLabel={t("allPaymentMethods")}
            />

            <FilterAutocomplete
              label={t("paymentStageField")}
              value={filters.paymentStage}
              onChange={(value) => handleFilterChange("paymentStage", value)}
              options={stageOptions}
              allLabel={t("allPaymentStages")}
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
              ? (t("updatingDashboard"))
              : (t("collectionScopeNote"))}
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
              aria-label={t("removeFilter", { label: chip.label, value: chip.value })}
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

function translateStage(name: string, t: ReturnType<typeof useLocalTranslations>) {
  // Stage masters can contain custom names; translate only recognized labels.
  const key = Object.entries(messages.en).find(([key, value]) =>
    (key.startsWith("stage") || key === "legacyPayment") && value === name,
  )?.[0];
  return key ? t(key as keyof typeof messages.en) : name;
}

function translatePaymentStatus(status: string, t: ReturnType<typeof useLocalTranslations>) {
  const key = `status${status}`;
  return t.has(key as keyof typeof messages.en)
    ? t(key as keyof typeof messages.en)
    : status;
}

function translatePaymentMethod(method: string, t: ReturnType<typeof useLocalTranslations>) {
  const key = `method${method.replace(/\s/g, "")}`;
  return t.has(key as keyof typeof messages.en)
    ? t(key as keyof typeof messages.en)
    : method;
}
