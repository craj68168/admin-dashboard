"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTranslator, useLocale } from "next-intl";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { enUS, jaJP } from "@mui/x-data-grid/locales";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import Breadcrumb from "@/components/Breadcrumb";
import NoDataOverlay from "@/components/common/NoDataOverlay";
import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";

import { useAuthStore } from "@/store/auth-store";
import { formatCreatedAt } from "@/utils/format-date";

import { useStaffClients } from "./hook";

const messages = {
  en: {
    breadcrumbs: {
      dashboard: "Dashboard",
      staff: "Staff",
      clients: "Clients"
    },
    thisClient: "this client",
    columns: {
      id: "ID",
      fullName: "Full Name",
      status: "Status",
      phone: "Phone",
      visaType: "Visa Type",
      createdAt: "Created At",
      action: "Action"
    },
    actions: {
      view: "View client",
      edit: "Edit client",
      delete: "Delete client"
    },
    deleteDialog: {
      title: "Delete Client",
      warning: "This action cannot be undone.",
      confirm: "Yes, Delete",
      cancel: "No",
      description: "Are you sure you want to delete <clientName>{name}</clientName>?"
    },
    notAvailable: "N/A",
    statuses: {
      registeredPaid: "Registered / Paid",
      vacancySearching: "Vacancy Searching",
      interviewFixedPreparation: "Interview Fixed / Preparation",
      interviewFailed: "Interview Failed",
      jobOfferReceived: "Naitei / Job Offer Received",
      jobOfferAccepted: "Job Offer Accepted",
      jobOfferNotAccepted: "Job Offer Not Accepted",
      visaDocumentsSubmitted: "Visa Documents Submitted",
      visaAppliedResultWaiting: "Visa Applied / Result Waiting",
      visaApproved: "Visa Approved",
      visaRejected: "Visa Rejected",
      companyJoining: "Waiting for Nyusha / Company Joining",
      employmentStartedCompanyJoined: "Employment Started / Company Joined",
      visaRenewal1Year: "Visa Renewal - 1 Year",
      visaRenewal3Years: "Visa Renewal - 3 Years",
      visaRenewal5Years: "Visa Renewal - 5 Years",
      returnToNepal: "Return to Nepal",
      new: "New",
      documentCollection: "Document Collection",
      processing: "Processing",
      cOEApplied: "COE Applied",
      cOEReceived: "COE Received",
      visaApplied: "Visa Applied",
      departed: "Departed",
      arrivedInJapan: "Arrived in Japan",
      registrationPending: "Registration Pending",
      registeredVacancySearching: "Registered / Vacancy Searching",
      active: "Active",
      inactive: "Inactive",
      approved: "Approved",
      completed: "Completed",
      success: "Success",
      rejected: "Rejected",
      cancelled: "Cancelled",
      deleted: "Deleted",
      pending: "Pending",
      waiting: "Waiting",
      inProgress: "In Progress",
      outstanding: "Outstanding"
    },
    visaTypes: {
      student: "Student",
      dependent: "Dependent",
      designatedActivitiesJobHunting: "Designated Activities - Job Hunting",
      designatedActivities: "Designated Activities - Other",
      engineerHumanitiesInternationalServices: "Engineer / Humanities / International Services",
      specifiedSkilledWorker1: "Specified Skilled Worker 1",
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
      longTermResident: "Long-Term Resident",
      other: "Other",
      working: "Working"
    }
  },
  ja: {
    breadcrumbs: {
      dashboard: "ダッシュボード",
      staff: "スタッフ",
      clients: "顧客"
    },
    thisClient: "この顧客",
    columns: {
      id: "ID",
      fullName: "氏名",
      status: "ステータス",
      phone: "電話番号",
      visaType: "ビザ種別",
      createdAt: "作成日",
      action: "操作"
    },
    actions: {
      view: "顧客を表示",
      edit: "顧客を編集",
      delete: "顧客を削除"
    },
    deleteDialog: {
      title: "顧客を削除",
      warning: "この操作は元に戻せません。",
      confirm: "はい、削除",
      cancel: "いいえ",
      description: "<clientName>{name}</clientName>を削除してもよろしいですか？"
    },
    notAvailable: "情報なし",
    statuses: {
      registeredPaid: "登録済み / 支払済み",
      vacancySearching: "求人検索中",
      interviewFixedPreparation: "面接確定 / 準備中",
      interviewFailed: "面接不合格",
      jobOfferReceived: "内定 / オファー受領",
      jobOfferAccepted: "内定承諾",
      jobOfferNotAccepted: "内定未承諾",
      visaDocumentsSubmitted: "ビザ書類提出済み",
      visaAppliedResultWaiting: "ビザ申請済み / 結果待ち",
      visaApproved: "ビザ承認",
      visaRejected: "ビザ却下",
      companyJoining: "入社待ち",
      employmentStartedCompanyJoined: "勤務開始 / 入社済み",
      visaRenewal1Year: "ビザ更新 - 1年",
      visaRenewal3Years: "ビザ更新 - 3年",
      visaRenewal5Years: "ビザ更新 - 5年",
      returnToNepal: "ネパールへ帰国",
      new: "新規",
      documentCollection: "書類収集中",
      processing: "処理中",
      cOEApplied: "COE申請済み",
      cOEReceived: "COE受領済み",
      visaApplied: "ビザ申請済み",
      departed: "出国済み",
      arrivedInJapan: "日本到着",
      registrationPending: "登録待ち",
      registeredVacancySearching: "登録済み / 求人検索中",
      active: "有効",
      inactive: "無効",
      approved: "承認済み",
      completed: "完了",
      success: "成功",
      rejected: "却下",
      cancelled: "キャンセル",
      deleted: "削除済み",
      pending: "保留中",
      waiting: "待機中",
      inProgress: "進行中",
      outstanding: "未完了"
    },
    visaTypes: {
      student: "留学",
      dependent: "家族滞在",
      designatedActivitiesJobHunting: "特定活動・就職活動",
      designatedActivities: "特定活動・その他",
      engineerHumanitiesInternationalServices: "技術・人文知識・国際業務",
      specifiedSkilledWorker1: "特定技能1号",
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
      working: "就労"
    }
  }
};

// Explicit aliases cover current codes and legacy labels without changing API values.
const statusMessageKeys: Readonly<Record<string, keyof typeof messages.en.statuses>> = {
  "registered/paid": "registeredPaid",
  registeredpaid: "registeredPaid",
  "vacancy searching": "vacancySearching",
  vacancysearching: "vacancySearching",
  "interview fixed/preparation": "interviewFixedPreparation",
  interviewfixedpreparation: "interviewFixedPreparation",
  "interview failed": "interviewFailed",
  interviewfailed: "interviewFailed",
  "naitei/job offer received": "jobOfferReceived",
  jobofferreceived: "jobOfferReceived",
  "job offer accepted": "jobOfferAccepted",
  jobofferaccepted: "jobOfferAccepted",
  "job offer rejected": "jobOfferNotAccepted",
  joboffernotaccepted: "jobOfferNotAccepted",
  "visa documents submitted": "visaDocumentsSubmitted",
  visadocumentssubmitted: "visaDocumentsSubmitted",
  "visa applied/result waiting": "visaAppliedResultWaiting",
  visaappliedresultwaiting: "visaAppliedResultWaiting",
  "visa approved": "visaApproved",
  visaapproved: "visaApproved",
  "visa rejected": "visaRejected",
  visarejected: "visaRejected",
  "waiting for nyusha/company joining": "companyJoining",
  companyjoining: "companyJoining",
  "employment started/company joined": "employmentStartedCompanyJoined",
  employmentstartedcompanyjoined: "employmentStartedCompanyJoined",
  "visa renewal - 1 year": "visaRenewal1Year",
  visarenewal1year: "visaRenewal1Year",
  "visa renewal - 3 years": "visaRenewal3Years",
  visarenewal3years: "visaRenewal3Years",
  "visa renewal - 5 years": "visaRenewal5Years",
  visarenewal5years: "visaRenewal5Years",
  "return to nepal": "returnToNepal",
  returntonepal: "returnToNepal",
  "job offer not accepted": "jobOfferNotAccepted",
  new: "new",
  "document collection": "documentCollection",
  processing: "processing",
  "coe applied": "cOEApplied",
  "coe received": "cOEReceived",
  "visa applied": "visaApplied",
  departed: "departed",
  "arrived in japan": "arrivedInJapan",
  "registration pending": "registrationPending",
  "registered/vacancy searching": "registeredVacancySearching",
  active: "active",
  inactive: "inactive",
  approved: "approved",
  completed: "completed",
  success: "success",
  rejected: "rejected",
  cancelled: "cancelled",
  deleted: "deleted",
  pending: "pending",
  waiting: "waiting",
  "in progress": "inProgress",
  outstanding: "outstanding"
};

const visaMessageKeys: Readonly<Record<string, keyof typeof messages.en.visaTypes>> = {
  student: "student",
  dependent: "dependent",
  designatedactivitiesjobhunting: "designatedActivitiesJobHunting",
  designatedactivities: "designatedActivities",
  engineerhumanitiesinternationalservices: "engineerHumanitiesInternationalServices",
  specifiedskilledworker1: "specifiedSkilledWorker1",
  specifiedskilledworker2: "specifiedSkilledWorker2",
  skilledlabor: "skilledLabor",
  technicalinterntraining: "technicalInternTraining",
  "intra-companytransferee": "intraCompanyTransferee",
  intracompanytransferee: "intraCompanyTransferee",
  nursingcare: "nursingCare",
  highlyskilledprofessional: "highlySkilledProfessional",
  businessmanager: "businessManager",
  permanentresident: "permanentResident",
  spousechildofjapanesenational: "spouseChildOfJapaneseNational",
  spousechildofpermanentresident: "spouseChildOfPermanentResident",
  longtermresident: "longTermResident",
  other: "other",
  "designated activities - job hunting": "designatedActivitiesJobHunting",
  "designated activities - other": "designatedActivities",
  "engineer/humanities/international services": "engineerHumanitiesInternationalServices",
  "specified skilled worker 1": "specifiedSkilledWorker1",
  "specified skilled worker 2": "specifiedSkilledWorker2",
  "skilled labor": "skilledLabor",
  "technical intern training": "technicalInternTraining",
  "intra-company transferee": "intraCompanyTransferee",
  "nursing care": "nursingCare",
  "highly skilled professional": "highlySkilledProfessional",
  "business manager": "businessManager",
  "permanent resident": "permanentResident",
  "spouse/child of japanese national": "spouseChildOfJapaneseNational",
  "spouse/child of permanent resident": "spouseChildOfPermanentResident",
  "long-term resident": "longTermResident",
  working: "working"
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
}


// =================================================
// DESIGN SYSTEM
// =================================================

const BRAND = "#107A64";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const INK = "#111827";
const INK_MUTED = "#4B5563";

const softCard = {
  bgcolor: "#ffffff",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 3,
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

// =================================================
// STATUS STYLE
// =================================================

const getStatusStyle = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || "";

  if (
    normalizedStatus.includes("active") ||
    normalizedStatus.includes("approved") ||
    normalizedStatus.includes("complete") ||
    normalizedStatus.includes("success")
  ) {
    return {
      color: BRAND,
      bgcolor: BRAND_SOFT,
      borderColor: "rgba(16, 122, 100, 0.14)",
    };
  }

  if (
    normalizedStatus.includes("inactive") ||
    normalizedStatus.includes("rejected") ||
    normalizedStatus.includes("cancel") ||
    normalizedStatus.includes("delete")
  ) {
    return {
      color: "#DC2626",
      bgcolor: "#FEF2F2",
      borderColor: "rgba(220, 38, 38, 0.12)",
    };
  }

  if (
    normalizedStatus.includes("pending") ||
    normalizedStatus.includes("waiting") ||
    normalizedStatus.includes("progress") ||
    normalizedStatus.includes("outstanding")
  ) {
    return {
      color: "#B7791F",
      bgcolor: "#FFFBEB",
      borderColor: "rgba(183, 121, 31, 0.14)",
    };
  }

  return {
    color: INK_MUTED,
    bgcolor: "#F9FAFB",
    borderColor: HAIRLINE,
  };
};

type DeleteDialogState = {
  open: boolean;
  clientId: string;
  clientName: string;
};

function StaffClientsContent() {
  const router = useRouter();
  const locale = useLocale();
  const t = useLocalTranslations();

  const role = useAuthStore((state) => state.user?.role);

  const { data, isPending, deleteClient, isDeleting } = useStaffClients();

  // =================================================
  // DELETE CONFIRMATION DIALOG
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
    if (!deleteDialog.clientId) return;

    deleteClient(deleteDialog.clientId, {
      onSuccess: () => {
        closeDeleteDialog();
      },
    });
  };

  // =================================================
  // COLUMNS
  // =================================================

  const columns: GridColDef[] = [
    {
      field: "clientId",
      headerName: t("columns.id"),
      flex: 0.7,
      minWidth: 130,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "fullName",
      headerName: t("columns.fullName"),
      flex: 1.1,
      minWidth: 170,
      resizable: false,
      disableColumnMenu: true,

      renderCell: ({ value }) => (
        <Box
          component="span"
          sx={{
            color: INK,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {value}
        </Box>
      ),
    },

    {
      field: "clientStatus",
      headerName: t("columns.status"),
      flex: 1.2,
      minWidth: 190,
      resizable: false,
      disableColumnMenu: true,

      renderCell: ({ value }) => {
        const status = String(value || "");

        return (
          <Chip
            size="small"
            label={translateStatus(status, t)}
            variant="outlined"
            sx={{
              ...getStatusStyle(status),

              height: 27,

              borderRadius: 999,

              fontSize: 11.5,

              fontWeight: 600,

              transition:
                "background-color 200ms ease, border-color 200ms ease, color 200ms ease",

              "& .MuiChip-label": {
                px: 1.35,
              },
            }}
          />
        );
      },
    },

    {
      field: "phone",
      headerName: t("columns.phone"),
      flex: 0.9,
      minWidth: 150,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "visaType",
      headerName: t("columns.visaType"),
      valueGetter: (_value, row) => translateVisaType(row.currentVisaStatus || row.visaType, t),
      flex: 0.9,
      minWidth: 150,
      resizable: false,
      disableColumnMenu: true,
    },

    {
      field: "createdAt",
      headerName: t("columns.createdAt"),
      flex: 1,
      minWidth: 180,
      resizable: false,
      disableColumnMenu: true,

      valueGetter: (_value, row) => formatClientCreatedAt(row.createdAt, t),
    },

    {
      field: "actions",
      headerName: t("columns.action"),
      width: role === "superadmin" ? 160 : 110,
      resizable: false,
      disableColumnMenu: true,
      sortable: false,
      filterable: false,

      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.25,
              height: "100%",
            }}
          >
            {/* VIEW CLIENT */}

            <Tooltip title={t("actions.view")}>
              <IconButton
                aria-label={t("actions.view")}
                onClick={() => router.push(`/admin/client/${row.clientId}`)}
                sx={{
                  width: 34,
                  height: 34,
                  color: BRAND,
                  borderRadius: 2,

                  transition:
                    "background-color 200ms ease, color 200ms ease, transform 200ms ease",

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

            {/* EDIT CLIENT */}

            <Tooltip title={t("actions.edit")}>
              <IconButton
                aria-label={t("actions.edit")}
                onClick={() =>
                  router.push(`/admin/client/edit?clientId=${row.clientId}`)
                }
                sx={{
                  width: 34,
                  height: 34,
                  color: INK_MUTED,
                  borderRadius: 2,

                  transition:
                    "background-color 200ms ease, color 200ms ease",

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

            {/* DELETE CLIENT - SUPER ADMIN ONLY */}

            {role === "superadmin" && (
              <Tooltip title={t("actions.delete")}>
                <span>
                  <IconButton
                    aria-label={t("actions.delete")}
                    disabled={isDeleting}
                    onClick={() =>
                      setDeleteDialog({
                        open: true,
                        clientId: String(row.clientId),
                        clientName: row.fullName || "",
                      })
                    }
                    sx={{
                      width: 34,
                      height: 34,
                      color: "#DC2626",
                      borderRadius: 2,

                      transition:
                        "background-color 200ms ease, color 200ms ease",

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
        );
      },
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "#F7F8F6",
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,

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
              maxWidth: 1320,
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
                    href: "/admin/dashboard",
                  },
                  {
                    label: t("breadcrumbs.staff"),
                    href: "/admin/staff",
                  },
                  {
                    label: t("breadcrumbs.clients"),
                  },
                ]}
              />
            </Box>

            {/* TABLE */}

            <Box
              sx={{
                ...softCard,
                overflow: "hidden",
              }}
            >
              <DataGrid
                localeText={
                  (locale === "ja" ? jaJP : enUS).components.MuiDataGrid.defaultProps.localeText
                }
                rows={data?.data || []}
                getRowId={(row) => row.clientId}
                columns={columns}
                disableColumnMenu
                pageSizeOptions={[5, 10]}
                slots={{
                  noRowsOverlay: NoDataOverlay,
                }}
                loading={isPending}
                hideFooter
                autoHeight
                sx={{
                  border: 0,

                  bgcolor: "#ffffff",

                  color: INK,

                  fontSize: 14,

                  // =============================================
                  // COLUMN HEADERS
                  // =============================================

                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "#F9FAFB",
                    borderBottom: `1px solid ${HAIRLINE}`,
                  },

                  "& .MuiDataGrid-columnHeader": {
                    bgcolor: "#F9FAFB",
                    borderRight: 0,

                    "&:focus, &:focus-within": {
                      outline: "none",
                    },
                  },

                  "& .MuiDataGrid-columnHeaderTitle": {
                    color: INK_MUTED,
                    fontSize: 11,
                    lineHeight: 1.2,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  },

                  "& .MuiDataGrid-columnSeparator": {
                    display: "none",
                  },

                  // =============================================
                  // ROWS
                  // =============================================

                  "& .MuiDataGrid-row": {
                    minHeight: "58px !important",
                    maxHeight: "58px !important",

                    borderBottom: `1px solid ${HAIRLINE}`,

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

                  // =============================================
                  // CELLS
                  // =============================================

                  "& .MuiDataGrid-cell": {
                    color: INK,
                    borderBottom: "none",

                    display: "flex",
                    alignItems: "center",

                    py: 0,

                    "&:focus, &:focus-within": {
                      outline: "none",
                    },
                  },

                  // =============================================
                  // ACTION COLUMN
                  // =============================================

                  '& .MuiDataGrid-cell[data-field="actions"]': {
                    bgcolor: "#ffffff",

                    transition: "background-color 200ms ease",
                  },

                  '& .MuiDataGrid-row:hover .MuiDataGrid-cell[data-field="actions"]':
                    {
                      bgcolor: "#F3F8F6",
                    },

                  // =============================================
                  // LOADING OVERLAY
                  // =============================================

                  "& .MuiDataGrid-overlay": {
                    bgcolor: "rgba(255, 255, 255, 0.88)",
                  },

                  "& .MuiCircularProgress-root": {
                    color: BRAND,
                  },

                  // =============================================
                  // SCROLLBAR
                  // =============================================

                  "& .MuiDataGrid-virtualScroller": {
                    "&::-webkit-scrollbar": {
                      width: 8,
                      height: 8,
                    },

                    "&::-webkit-scrollbar-track": {
                      bgcolor: "transparent",
                    },

                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: "rgba(17, 24, 39, 0.12)",
                      borderRadius: 999,
                    },

                    "&::-webkit-scrollbar-thumb:hover": {
                      bgcolor: "rgba(17, 24, 39, 0.20)",
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* =================================================
          DELETE CLIENT CONFIRMATION
      ================================================= */}

      <ConfirmActionDialog
        open={deleteDialog.open}
        title={t("deleteDialog.title")}
        description={
          <>
            {t.rich("deleteDialog.description", {
              name: deleteDialog.clientName || t("thisClient"),
              clientName: (chunks) => <strong>{chunks}</strong>,
            })}
            <div style={{ marginTop: 12 }}>
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
}

export default StaffClientsContent;

function normalizeLabel(value: string) {
  return value.trim().toLowerCase().replace(/\s*\/\s*/g, "/");
}

function translateStatus(value: string | null | undefined, t: ReturnType<typeof useLocalTranslations>) {
  if (!value) return t("notAvailable");
  const key = statusMessageKeys[normalizeLabel(value)];
  return key ? t(`statuses.${key}`) : value;
}

function translateVisaType(value: string | null | undefined, t: ReturnType<typeof useLocalTranslations>) {
  if (!value) return t("notAvailable");
  const key = visaMessageKeys[normalizeLabel(value)];
  return key ? t(`visaTypes.${key}`) : value;
}

function formatClientCreatedAt(value: string | null | undefined, t: ReturnType<typeof useLocalTranslations>) {
  const formatted = formatCreatedAt(value);
  return formatted === "N/A" ? t("notAvailable") : formatted;
}
