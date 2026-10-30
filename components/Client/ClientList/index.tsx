"use client";
import { useState } from "react";
import { createTranslator, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { enUS, jaJP } from "@mui/x-data-grid/locales";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import TableViewOutlinedIcon from "@mui/icons-material/TableViewOutlined";
import Breadcrumb from "@/components/Breadcrumb";
import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";
import NoDataOverlay from "@/components/common/NoDataOverlay";
import Pagination from "@/components/common/Pagination";
import PaginationRowsLabel from "@/components/common/PaginationRowsLabel";
import SearchFilter from "@/components/common/SearchFilter";
import type { FilterField } from "@/components/common/SearchFilter/types";
import {
  CURRENT_VISA_STATUS_OPTIONS,
  PREFER_CATEGORY_OPTIONS,
  JAPANESE_LEVELS,
  NATIONALITIES,
} from "@/components/constant";
import { useClientHook } from "./hook";
import type { ClientFilterValues, ClientListItem } from "./type";
import { getPortalPaths } from "@/lib/portal-routes";

const messages = {
  "en": {
    "breadcrumbs": {
      "dashboard": "Dashboard",
      "clients": "Clients"
    },
    "addClient": "Add Client",
    "registrationPending": "Registration Pending",
    "thisClient": "this client",
    "columns": {
      "id": "ID",
      "fullName": "Full Name",
      "phone": "Phone",
      "visaType": "Visa Type",
      "progress": "Progress",
      "assignedTo": "Assigned To",
      "action": "Action",
      "currentVisaStatus": "Current Visa Status",
      "category": "Category"
    },
    "actions": {
      "view": "View client",
      "edit": "Edit client",
      "delete": "Delete client"
    },
    "deleteDialog": {
      "title": "Delete Client",
      "warning": "This action cannot be undone.",
      "confirm": "Yes, Delete",
      "cancel": "No",
      "description": "Are you sure you want to delete <clientName>{name}</clientName>?"
    },
    "filters": {
      "currentVisaStatus": "Current Visa Status",
      "allVisaStatuses": "All visa statuses",
      "preferCategory": "Preferred Category",
      "allCategories": "All categories",
      "currentStage": "Current Stage",
      "allStages": "All stages",
      "japaneseLevel": "Japanese Level",
      "allJapaneseLevels": "All Japanese levels",
      "nationality": "Nationality",
      "allNationalities": "All nationalities",
      "assignedStaff": "Assigned Staff",
      "allStaff": "All staff"
    },
    "search": {
      "label": "What are you looking for?",
      "placeholder": "Client ID, name, phone, email...",
      "submit": "Search clients",
      "clear": "Clear"
    },
    "export": {
      "downloading": "Downloading...",
      "csv": "CSV",
      "pdf": "PDF",
      "excel": "Excel"
    },
    "options": {
      "currentVisaStatus": {
        "student": "Student",
        "dependent": "Dependent",
        "designatedActivitiesJobHunting": "Designated Activities - Job Hunting",
        "designatedActivities": "Designated Activities - Other",
        "engineerHumanitiesInternationalServices": "Engineer / Humanities / International Services",
        "specifiedSkilledWorker1": "Specified Skilled Worker 1",
        "specifiedSkilledWorker2": "Specified Skilled Worker 2",
        "skilledLabor": "Skilled Labor",
        "technicalInternTraining": "Technical Intern Training",
        "intraCompanyTransferee": "Intra-company Transferee",
        "nursingCare": "Nursing Care",
        "highlySkilledProfessional": "Highly Skilled Professional",
        "businessManager": "Business Manager",
        "permanentResident": "Permanent Resident",
        "spouseChildOfJapaneseNational": "Spouse / Child of Japanese National",
        "spouseChildOfPermanentResident": "Spouse / Child of Permanent Resident",
        "longTermResident": "Long-Term Resident",
        "other": "Other"
      },
      "preferCategory": {
        "newJob": "Shushoku / New Job",
        "jobChange": "Tenshoku / Job Change",
        "dependentVisaRenewal": "Dependent Visa Renewal",
        "visaServiceOnlyRenewal": "Visa Service Only / Renewal",
        "visaServiceOnlyChange": "Visa Service Only / Change",
        "otherVisaService": "Other Visa Service"
      },
      "japaneseLanguageLevel": {
        "n1": "N1",
        "n2": "N2",
        "n3": "N3",
        "n4": "N4",
        "n5": "N5",
        "none": "No JLPT / None"
      },
      "nationality": {
        "nepali": "Nepali",
        "indian": "Indian",
        "pakistani": "Pakistani",
        "bangladeshi": "Bangladeshi",
        "sriLankan": "Sri Lankan",
        "vietnamese": "Vietnamese",
        "myanmar": "Myanmar",
        "indonesian": "Indonesian",
        "filipino": "Filipino",
        "chinese": "Chinese",
        "other": "Other"
      }
    },
    "stages": {
      "registeredPaid": "Registered / Paid",
      "vacancySearching": "Vacancy Searching",
      "interviewFixedPreparation": "Interview Fixed / Preparation",
      "interviewFailed": "Interview Failed",
      "jobOfferReceived": "Naitei / Job Offer Received",
      "jobOfferAccepted": "Job Offer Accepted",
      "jobOfferNotAccepted": "Job Offer Not Accepted",
      "visaDocumentsSubmitted": "Visa Documents Submitted",
      "visaAppliedResultWaiting": "Visa Applied / Result Waiting",
      "visaApproved": "Visa Approved",
      "visaRejected": "Visa Rejected",
      "companyJoining": "Waiting for Nyusha / Company Joining",
      "employmentStartedCompanyJoined": "Employment Started / Company Joined",
      "visaRenewal1Year": "Visa Renewal - 1 Year",
      "visaRenewal3Years": "Visa Renewal - 3 Years",
      "visaRenewal5Years": "Visa Renewal - 5 Years",
      "returnToNepal": "Return to Nepal",
      "new": "New",
      "documentCollection": "Document Collection",
      "processing": "Processing",
      "cOEApplied": "COE Applied",
      "cOEReceived": "COE Received",
      "visaApplied": "Visa Applied",
      "departed": "Departed",
      "arrivedInJapan": "Arrived in Japan",
      "registrationPending": "Registration Pending",
      "registeredVacancySearching": "Registered / Vacancy Searching",
      "legacyPayment": "Legacy Payment"
    }
  },
  "ja": {
    "breadcrumbs": {
      "dashboard": "ダッシュボード",
      "clients": "顧客"
    },
    "addClient": "顧客を追加",
    "registrationPending": "登録待ち",
    "thisClient": "この顧客",
    "columns": {
      "id": "ID",
      "fullName": "氏名",
      "phone": "電話番号",
      "visaType": "ビザ種別",
      "progress": "進捗",
      "assignedTo": "担当者",
      "action": "操作",
      "currentVisaStatus": "現在の在留資格",
      "category": "カテゴリー"
    },
    "actions": {
      "view": "顧客を表示",
      "edit": "顧客を編集",
      "delete": "顧客を削除"
    },
    "deleteDialog": {
      "title": "顧客を削除",
      "warning": "この操作は元に戻せません。",
      "confirm": "はい、削除",
      "cancel": "いいえ",
      "description": "<clientName>{name}</clientName>を削除してもよろしいですか？"
    },
    "filters": {
      "currentVisaStatus": "現在の在留資格",
      "allVisaStatuses": "すべての在留資格",
      "preferCategory": "希望カテゴリー",
      "allCategories": "すべてのカテゴリー",
      "currentStage": "現在のステージ",
      "allStages": "すべてのステージ",
      "japaneseLevel": "日本語レベル",
      "allJapaneseLevels": "すべての日本語レベル",
      "nationality": "国籍",
      "allNationalities": "すべての国籍",
      "assignedStaff": "担当スタッフ",
      "allStaff": "すべてのスタッフ"
    },
    "search": {
      "label": "検索条件を入力してください",
      "placeholder": "顧客ID、氏名、電話番号、メールアドレス...",
      "submit": "顧客を検索",
      "clear": "クリア"
    },
    "export": {
      "downloading": "ダウンロード中...",
      "csv": "CSV",
      "pdf": "PDF",
      "excel": "Excel"
    },
    "options": {
      "currentVisaStatus": {
        "student": "留学",
        "dependent": "家族滞在",
        "designatedActivitiesJobHunting": "特定活動・就職活動",
        "designatedActivities": "特定活動・その他",
        "engineerHumanitiesInternationalServices": "技術・人文知識・国際業務",
        "specifiedSkilledWorker1": "特定技能1号",
        "specifiedSkilledWorker2": "特定技能2号",
        "skilledLabor": "技能",
        "technicalInternTraining": "技能実習",
        "intraCompanyTransferee": "企業内転勤",
        "nursingCare": "介護",
        "highlySkilledProfessional": "高度専門職",
        "businessManager": "経営・管理",
        "permanentResident": "永住者",
        "spouseChildOfJapaneseNational": "日本人の配偶者等",
        "spouseChildOfPermanentResident": "永住者の配偶者等",
        "longTermResident": "定住者",
        "other": "その他"
      },
      "preferCategory": {
        "newJob": "就職 / 新規就職",
        "jobChange": "転職",
        "dependentVisaRenewal": "家族滞在ビザ更新",
        "visaServiceOnlyRenewal": "ビザ手続きのみ / 更新",
        "visaServiceOnlyChange": "ビザ手続きのみ / 変更",
        "otherVisaService": "その他のビザ手続き"
      },
      "japaneseLanguageLevel": {
        "n1": "N1",
        "n2": "N2",
        "n3": "N3",
        "n4": "N4",
        "n5": "N5",
        "none": "JLPTなし / 未取得"
      },
      "nationality": {
        "nepali": "ネパール",
        "indian": "インド",
        "pakistani": "パキスタン",
        "bangladeshi": "バングラデシュ",
        "sriLankan": "スリランカ",
        "vietnamese": "ベトナム",
        "myanmar": "ミャンマー",
        "indonesian": "インドネシア",
        "filipino": "フィリピン",
        "chinese": "中国",
        "other": "その他"
      }
    },
    "stages": {
      "registeredPaid": "登録済み / 支払済み",
      "vacancySearching": "求人検索中",
      "interviewFixedPreparation": "面接確定 / 準備中",
      "interviewFailed": "面接不合格",
      "jobOfferReceived": "内定 / オファー受領",
      "jobOfferAccepted": "内定承諾",
      "jobOfferNotAccepted": "内定未承諾",
      "visaDocumentsSubmitted": "ビザ書類提出済み",
      "visaAppliedResultWaiting": "ビザ申請済み / 結果待ち",
      "visaApproved": "ビザ承認",
      "visaRejected": "ビザ却下",
      "companyJoining": "入社待ち",
      "employmentStartedCompanyJoined": "勤務開始 / 入社済み",
      "visaRenewal1Year": "ビザ更新 - 1年",
      "visaRenewal3Years": "ビザ更新 - 3年",
      "visaRenewal5Years": "ビザ更新 - 5年",
      "returnToNepal": "ネパールへ帰国",
      "new": "新規",
      "documentCollection": "書類収集中",
      "processing": "処理中",
      "cOEApplied": "COE申請済み",
      "cOEReceived": "COE受領済み",
      "visaApplied": "ビザ申請済み",
      "departed": "出国済み",
      "arrivedInJapan": "日本到着",
      "registrationPending": "登録待ち",
      "registeredVacancySearching": "登録済み / 求人検索中",
      "legacyPayment": "過去の入金"
    }
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({locale, messages: messages[locale === "ja" ? "ja" : "en"]});
}

const stageMessageKeys: Readonly<Record<string, keyof typeof messages.en.stages>> = {
  "legacy payment": "legacyPayment",
  "registered/paid": "registeredPaid",
  "registeredpaid": "registeredPaid",
  "vacancy searching": "vacancySearching",
  "vacancysearching": "vacancySearching",
  "interview fixed/preparation": "interviewFixedPreparation",
  "interviewfixedpreparation": "interviewFixedPreparation",
  "interview failed": "interviewFailed",
  "interviewfailed": "interviewFailed",
  "naitei/job offer received": "jobOfferReceived",
  "jobofferreceived": "jobOfferReceived",
  "job offer accepted": "jobOfferAccepted",
  "jobofferaccepted": "jobOfferAccepted",
  "job offer rejected": "jobOfferNotAccepted",
  "joboffernotaccepted": "jobOfferNotAccepted",
  "visa documents submitted": "visaDocumentsSubmitted",
  "visadocumentssubmitted": "visaDocumentsSubmitted",
  "visa applied/result waiting": "visaAppliedResultWaiting",
  "visaappliedresultwaiting": "visaAppliedResultWaiting",
  "visa approved": "visaApproved",
  "visaapproved": "visaApproved",
  "visa rejected": "visaRejected",
  "visarejected": "visaRejected",
  "waiting for nyusha/company joining": "companyJoining",
  "companyjoining": "companyJoining",
  "employment started/company joined": "employmentStartedCompanyJoined",
  "employmentstartedcompanyjoined": "employmentStartedCompanyJoined",
  "visa renewal - 1 year": "visaRenewal1Year",
  "visarenewal1year": "visaRenewal1Year",
  "visa renewal - 3 years": "visaRenewal3Years",
  "visarenewal3years": "visaRenewal3Years",
  "visa renewal - 5 years": "visaRenewal5Years",
  "visarenewal5years": "visaRenewal5Years",
  "return to nepal": "returnToNepal",
  "returntonepal": "returnToNepal",
  "job offer not accepted": "jobOfferNotAccepted",
  "new": "new",
  "document collection": "documentCollection",
  "processing": "processing",
  "coe applied": "cOEApplied",
  "coe received": "cOEReceived",
  "visa applied": "visaApplied",
  "departed": "departed",
  "arrived in japan": "arrivedInJapan",
  "registration pending": "registrationPending",
  "registered/vacancy searching": "registeredVacancySearching"
};

function translateStage(value: string | null | undefined, t: ReturnType<typeof useLocalTranslations>) {
  if (!value) return "-";
  const key = stageMessageKeys[value.trim().toLowerCase().replace(/\s*\/\s*/g, "/")];
  return key ? t(`stages.${key}`) : value;
}

// =================================================
// DESIGN
// =================================================
const BRAND = "#107A64";
const BRAND_HOVER = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#374151";
const DANGER = "#DC2626";
const softCard = {
  bgcolor: "#ffffff",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};
// =================================================
// DELETE DIALOG
// =================================================
type DeleteDialogState = {
  open: boolean;
  clientId: string;
  clientName: string;
};
// =================================================
// CLIENT LIST
// =================================================
const ClientListPage = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useLocalTranslations();
  const {
    role,
    clientData,
    clientFilters,
    isClientLoading,
    deleteClient,
    isDeleting,
    handleCreateClient,
    handleClientSearch,
    handleClientFilterReset,
    pagination,
    onPageChange,
    staffOptions,
    stageOptions,
    downloadClients,
    exportingFormat,
  } = useClientHook();
  const paths = getPortalPaths(role);
  // =================================================
  // DISPLAY HELPERS
  // =================================================
  const getCurrentVisaStatusLabel = (value: string) => {
    const option = CURRENT_VISA_STATUS_OPTIONS.find(
      (item) => item.value === value,
    );
    if (!option) {
      return value || "-";
    }
    return t(`options.currentVisaStatus.${option.key}` as never);
  };
  const getPreferCategoryLabel = (value?: string) => {
    if (!value) {
      return "-";
    }
    const option = PREFER_CATEGORY_OPTIONS.find((item) => item.value === value);
    if (!option) {
      return value;
    }
    return t(`options.preferCategory.${option.key}` as never);
  };
  // =================================================
  // FILTER FIELDS
  // =================================================
  const clientFilterFields: FilterField<ClientFilterValues>[] = [
    {
      type: "select",
      name: "currentVisaStatus",
      label: t("filters.currentVisaStatus"),
      placeholder: t("filters.allVisaStatuses"),
      options: CURRENT_VISA_STATUS_OPTIONS.map((option) => ({
        label: t(`options.currentVisaStatus.${option.key}` as never),
        value: option.value,
      })),
    },
    {
      type: "select",
      name: "preferCategory",
      label: t("filters.preferCategory"),
      placeholder: t("filters.allCategories"),
      options: PREFER_CATEGORY_OPTIONS.map((option) => ({
        label: t(`options.preferCategory.${option.key}` as never),
        value: option.value,
      })),
    },
    {
      type: "select",
      name: "currentStage",
      label: t("filters.currentStage"),
      placeholder: t("filters.allStages"),
      options: stageOptions.map((option) => ({...option, label: translateStage(option.label, t)})),
    },
    {
      type: "select",
      name: "japaneseLevel",
      label: t("filters.japaneseLevel"),
      placeholder: t("filters.allJapaneseLevels"),
      options: JAPANESE_LEVELS.map((option) => ({
        label: t(`options.japaneseLanguageLevel.${option.key}` as never),
        value: option.value,
      })),
    },
    {
      type: "select",
      name: "nationality",
      label: t("filters.nationality"),
      placeholder: t("filters.allNationalities"),
      options: NATIONALITIES.map((option) => ({
        label: t(`options.nationality.${option.key}` as never),
        value: option.value,
      })),
    },
    ...(role === "superadmin"
      ? [
          {
            type: "select" as const,
            name: "assignedStaff" as const,
            label: t("filters.assignedStaff"),
            placeholder: t("filters.allStaff"),
            options: staffOptions,
          },
        ]
      : []),
  ];
  // =================================================
  // DELETE DIALOG
  // =================================================
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    clientId: "",
    clientName: "",
  });
  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      clientId: "",
      clientName: "",
    });
  };
  const handleConfirmDelete = () => {
    if (!deleteDialog.clientId) {
      return;
    }
    deleteClient(deleteDialog.clientId, {
      onSuccess: () => {
        closeDeleteDialog();
      },
    });
  };
  // =================================================
  // COLUMNS
  // =================================================
  const columns: GridColDef<ClientListItem>[] = [
    {
      field: "clientId",
      headerName: t("columns.id"),
      flex: 0.75,
      minWidth: 140,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "fullName",
      headerName: t("columns.fullName"),
      flex: 1.25,
      minWidth: 190,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "phone",
      headerName: t("columns.phone"),
      flex: 1,
      minWidth: 150,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "currentVisaStatus",
      headerName: t("columns.currentVisaStatus"),
      flex: 1.15,
      minWidth: 190,
      resizable: false,
      disableColumnMenu: true,
      valueGetter: (_value, row) =>
        getCurrentVisaStatusLabel(row.currentVisaStatus),
    },
    {
      field: "preferCategory",
      headerName: t("columns.category"),
      flex: 1.05,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,
      valueGetter: (_value, row) => getPreferCategoryLabel(row.preferCategory),
    },
    {
      field: "currentStage",
      headerName: t("columns.progress"),
      flex: 1.25,
      minWidth: 220,
      resizable: false,
      disableColumnMenu: true,
      valueGetter: (_value, row) =>
        translateStage(row.currentStageDetails?.name || row.clientStatus || row.currentStage, t),
    },
    {
      field: "assignedStaff",
      headerName: t("columns.assignedTo"),
      flex: 1.05,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,
      valueGetter: (_value, row) =>
        row.assignedStaffDetails?.name || row.assignedStaff || "-",
    },
    {
      field: "actions",
      headerName: t("columns.action"),
      width: role === "superadmin" ? 150 : 110,
      resizable: false,
      disableColumnMenu: true,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            height: "100%",
          }}
        >
          <Tooltip title={t("actions.view")}>
            <IconButton
              aria-label={t("actions.view")}
              onClick={() =>
                router.push(paths.client(row.clientId))
              }
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                color: BRAND,
                "&:hover": {
                  bgcolor: BRAND_SOFT,
                },
                "& .MuiSvgIcon-root": {
                  fontSize: 19,
                },
              }}
            >
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("actions.edit")}>
            <IconButton
              aria-label={t("actions.edit")}
              onClick={() =>
                router.push(paths.editClient(row.clientId))
              }
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                color: INK_MUTED,
                "&:hover": {
                  bgcolor: BRAND_SOFT,
                  color: BRAND,
                },
                "& .MuiSvgIcon-root": {
                  fontSize: 19,
                },
              }}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          {role === "superadmin" && (
            <Tooltip title={t("actions.delete")}>
              <span>
                <IconButton
                  aria-label={t("actions.delete")}
                  disabled={isDeleting}
                  onClick={() =>
                    setDeleteDialog({
                      open: true,
                      clientId: row.clientId,
                      clientName: row.fullName || "",
                    })
                  }
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 2,
                    color: DANGER,
                    "&:hover": {
                      bgcolor: "#FEF2F2",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(220, 38, 38, 0.35)",
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: 19,
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];
  // =================================================
  // EXPORT BUTTON STYLE
  // =================================================
  const exportButtonSx = {
    minHeight: 38,
    px: 1.5,
    borderRadius: 2,
    textTransform: "none",
    fontSize: 13,
    fontWeight: 600,
  } as const;
  // =================================================
  // UI
  // =================================================
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F7F8F6",
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          pb: {
            xs: 3,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1450,
            mx: "auto",
          }}
        >
          {/* BREADCRUMB */}
          <Box
            sx={{
              mb: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            <Breadcrumb
              items={[
                {
                  label: t("breadcrumbs.dashboard"),
                  href: paths.dashboard,
                },
                {
                  label: t("breadcrumbs.clients"),
                  current: true,
                },
              ]}
            />
          </Box>
          {/* ADD CLIENT */}
          <Box
            sx={{
              display: "flex",
              justifyContent: {
                xs: "stretch",
                sm: "flex-end",
              },
              mb: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={handleCreateClient}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                minHeight: 42,
                px: 2.25,
                bgcolor: BRAND,
                color: "#ffffff",
                borderRadius: 2.5,
                fontSize: 14,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: BRAND_HOVER,
                  boxShadow: "none",
                },
              }}
            >
              {t("addClient")}
            </Button>
          </Box>
          {/* FILTERS */}
          <Box
            sx={{
              mb: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            <SearchFilter<ClientFilterValues>
              key={JSON.stringify(clientFilters)}
              searchField={{
                name: "keyword",
                label: t("search.label"),
                placeholder: t("search.placeholder"),
              }}
              fields={clientFilterFields}
              initialValues={clientFilters}
              onSearch={handleClientSearch}
              onReset={handleClientFilterReset}
              searchButtonText={t("search.submit")}
              resetButtonText={t("search.clear")}
              isLoading={isClientLoading}
              rightAction={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {/* CSV */}
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<DescriptionOutlinedIcon />}
                    disabled={exportingFormat !== null}
                    onClick={() => downloadClients("csv")}
                    sx={{
                      ...exportButtonSx,
                      borderColor: BRAND,
                      color: BRAND,
                      "&:hover": {
                        borderColor: BRAND_HOVER,
                        bgcolor: BRAND_SOFT,
                      },
                    }}
                  >
                    {exportingFormat === "csv" ? t("export.downloading") : t("export.csv")}
                  </Button>
                  {/* PDF */}
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<PictureAsPdfOutlinedIcon />}
                    disabled={exportingFormat !== null}
                    onClick={() => downloadClients("pdf")}
                    sx={{
                      ...exportButtonSx,
                      borderColor: DANGER,
                      color: DANGER,
                      "&:hover": {
                        borderColor: "#B91C1C",
                        bgcolor: "#FEF2F2",
                      },
                    }}
                  >
                    {exportingFormat === "pdf" ? t("export.downloading") : t("export.pdf")}
                  </Button>
                  {/* EXCEL */}
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<TableViewOutlinedIcon />}
                    disabled={exportingFormat !== null}
                    onClick={() => downloadClients("xlsx")}
                    sx={{
                      ...exportButtonSx,
                      borderColor: BRAND,
                      color: BRAND,
                      "&:hover": {
                        borderColor: BRAND_HOVER,
                        bgcolor: BRAND_SOFT,
                      },
                    }}
                  >
                    {exportingFormat === "xlsx" ? t("export.downloading") : t("export.excel")}
                  </Button>
                </Box>
              }
            />
          </Box>
          {/* TABLE */}
          <Box
            sx={{
              ...softCard,
              width: "100%",
              overflow: "hidden",
            }}
          >
            {/* TOP PAGINATION */}
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                justifyContent: "space-between",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
                px: {
                  xs: 2,
                  sm: 2.5,
                },
                py: 1.25,
                borderBottom: `1px solid ${HAIRLINE}`,
                bgcolor: "#FAFAFA",
              }}
            >
              <PaginationRowsLabel
                count={pagination?.total ?? 0}
                from={pagination?.from ?? null}
                to={pagination?.to ?? null}
              />
              <Pagination
                page={pagination?.current_page ?? 1}
                total={pagination?.total ?? 0}
                pageSize={pagination?.per_page ?? 10}
                disabled={isClientLoading}
                onPageChange={onPageChange}
              />
            </Box>
            {/* DATA GRID */}
            <DataGrid
              localeText={(locale === "ja" ? jaJP : enUS).components.MuiDataGrid.defaultProps.localeText}
              rows={clientData}
              columns={columns}
              getRowId={(row) => row.clientId}
              loading={isClientLoading}
              disableColumnMenu
              disableRowSelectionOnClick
              hideFooter
              autoHeight
              columnHeaderHeight={44}
              slots={{
                noRowsOverlay: NoDataOverlay,
              }}
              sx={{
                border: 0,
                bgcolor: "#ffffff",
                color: INK,
                fontSize: 14,
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: "#F9FAFB",
                  borderBottom: `1px solid ${HAIRLINE}`,
                },
                "& .MuiDataGrid-columnHeader": {
                  bgcolor: "#6ec5c2",
                  "&:focus, &:focus-within": {
                    outline: "none",
                  },
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  color: INK_MUTED,
                  fontSize: 11,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                },
                "& .MuiDataGrid-columnSeparator": {
                  display: "none",
                },
                "& .MuiDataGrid-row": {
                  minHeight: "58px !important",
                  maxHeight: "58px !important",
                  borderBottom: `1px solid ${HAIRLINE}`,
                  bgcolor: "#ffffff",
                  transition: "background-color 200ms ease",
                  "&:last-of-type": {
                    borderBottom: 0,
                  },
                  "&:hover": {
                    bgcolor: `${BRAND_SOFT} !important`,
                  },
                  "&.Mui-selected": {
                    bgcolor: `${BRAND_SOFT} !important`,
                    "&:hover": {
                      bgcolor: `${BRAND_SOFT} !important`,
                    },
                  },
                },
                "& .MuiDataGrid-cell": {
                  display: "flex",
                  alignItems: "center",
                  color: INK,
                  borderBottom: 0,
                  py: 0,
                  "&:focus, &:focus-within": {
                    outline: "none",
                  },
                },
                '& .MuiDataGrid-cell[data-field="fullName"]': {
                  fontWeight: 600,
                },
                '& .MuiDataGrid-cell[data-field="clientId"], & .MuiDataGrid-cell[data-field="phone"], & .MuiDataGrid-cell[data-field="currentVisaStatus"]':
                  {
                    color: INK_MUTED,
                  },
                '& .MuiDataGrid-cell[data-field="currentStage"]': {
                  color: BRAND,
                  fontWeight: 600,
                },
                '& .MuiDataGrid-cell[data-field="actions"]': {
                  bgcolor: "#ffffff",
                },
                '& .MuiDataGrid-row:hover .MuiDataGrid-cell[data-field="actions"]':
                  {
                    bgcolor: "#F3F8F6",
                  },
                "& .MuiDataGrid-overlay": {
                  bgcolor: "rgba(255, 255, 255, 0.88)",
                },
                "& .MuiCircularProgress-root": {
                  color: BRAND,
                },
              }}
            />
            {/* BOTTOM PAGINATION */}
            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                justifyContent: "space-between",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
                px: {
                  xs: 2,
                  sm: 2.5,
                },
                py: 1.25,
                borderTop: `1px solid ${HAIRLINE}`,
                bgcolor: "#FAFAFA",
              }}
            >
              <PaginationRowsLabel
                count={pagination?.total ?? 0}
                from={pagination?.from ?? null}
                to={pagination?.to ?? null}
              />
              <Pagination
                page={pagination?.current_page ?? 1}
                total={pagination?.total ?? 0}
                pageSize={pagination?.per_page ?? 10}
                disabled={isClientLoading}
                onPageChange={onPageChange}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      {/* DELETE CONFIRMATION */}
      <ConfirmActionDialog
        open={deleteDialog.open}
        title={t("deleteDialog.title")}
        description={
          <>
            {t.rich("deleteDialog.description", {
              name: deleteDialog.clientName || t("thisClient"),
              clientName: (chunks) => <strong>{chunks}</strong>,
            })}
            <div
              style={{
                marginTop: 12,
              }}
            >
              {t("deleteDialog.warning")}
            </div>
          </>
        }
        confirmText={t("deleteDialog.confirm")}
        cancelText={t("deleteDialog.cancel")}
        confirmColor="error"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteDialog}
      />
    </>
  );
};
export default ClientListPage;
