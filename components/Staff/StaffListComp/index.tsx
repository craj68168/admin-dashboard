"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createTranslator, useLocale } from "next-intl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import { keyframes } from "@mui/material/styles";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { enUS, jaJP } from "@mui/x-data-grid/locales";

import Breadcrumb from "@/components/Breadcrumb";
import { useAuthStore } from "@/store/auth-store";
import { formatCreatedAt } from "@/utils/format-date";
import NoDataOverlay from "@/components/common/NoDataOverlay";
import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";
import SearchFilter from "@/components/common/SearchFilter";
import type { FilterField } from "@/components/common/SearchFilter/types";
import Pagination from "@/components/common/Pagination";
import PaginationRowsLabel from "@/components/common/PaginationRowsLabel";

import { useStaffHook } from "./hook";
import type { StaffFilterValues, StaffRecord } from "./type";

const messages = {
  en: {
    breadcrumbs: {
      dashboard: "Dashboard",
      staff: "Staff"
    },
    title: "Staff",
    description: "Manage staff accounts, access and status.",
    addStaff: "Add Staff",
    thisStaffMember: "this staff member",
    filters: {
      search: {
        label: "What are you looking for?",
        placeholder: "Staff ID, name, email, or phone"
      },
      staffMember: {
        label: "Staff member",
        placeholder: "All staff members"
      },
      location: {
        label: "Location",
        placeholder: "All locations",
        options: {
          USA: "USA",
          Japan: "Japan",
          Nepal: "Nepal",
          Other: "Other"
        }
      },
      accountStatus: {
        label: "Account status",
        placeholder: "All statuses",
        options: {
          active: "Active",
          inactive: "Inactive"
        }
      },
      searchButton: "Search staff",
      clearButton: "Clear"
    },
    columns: {
      id: "ID",
      fullName: "Full name",
      email: "Email",
      location: "Location",
      status: "Status",
      createdAt: "Created At",
      action: "Action"
    },
    status: {
      active: "Active",
      inactive: "Inactive"
    },
    actions: {
      viewClients: "View staff clients",
      viewDetails: "View staff details",
      edit: "Edit staff",
      disable: "Disable staff",
      activate: "Activate staff"
    },
    confirmStatus: {
      disableTitle: "Disable Staff",
      activateTitle: "Activate Staff",
      disableWarning: "This staff member will not be able to log in while the account is disabled.",
      disableConfirm: "Yes, Disable",
      activateConfirm: "Yes, Activate",
      cancel: "No",
      disableDescription: "Are you sure you want to <action>disable</action> <staffName>{name}</staffName>?",
      activateDescription: "Are you sure you want to <action>activate</action> <staffName>{name}</staffName>?"
    },
    error: {
      title: "Unable to load staff",
      description: "Something went wrong while loading the staff list.",
      retry: "Try Again"
    },
    views: {
      table: "Table view",
      cards: "Card view",
      swipeHint: "Swipe table horizontally to see more columns"
    },
    pagination: {
      itemLabel: "staff members"
    },
    notAvailable: "N/A"
  },
  ja: {
    breadcrumbs: {
      dashboard: "ダッシュボード",
      staff: "スタッフ"
    },
    title: "スタッフ",
    description: "スタッフアカウント、アクセス権、ステータスを管理します。",
    addStaff: "スタッフを追加",
    thisStaffMember: "このスタッフ",
    filters: {
      search: {
        label: "検索条件を入力してください",
        placeholder: "スタッフID、氏名、メール、電話番号"
      },
      staffMember: {
        label: "スタッフ",
        placeholder: "すべてのスタッフ"
      },
      location: {
        label: "所在地",
        placeholder: "すべての所在地",
        options: {
          USA: "アメリカ",
          Japan: "日本",
          Nepal: "ネパール",
          Other: "その他"
        }
      },
      accountStatus: {
        label: "アカウント状態",
        placeholder: "すべての状態",
        options: {
          active: "有効",
          inactive: "無効"
        }
      },
      searchButton: "スタッフを検索",
      clearButton: "クリア"
    },
    columns: {
      id: "ID",
      fullName: "氏名",
      email: "メール",
      location: "所在地",
      status: "ステータス",
      createdAt: "作成日",
      action: "操作"
    },
    status: {
      active: "有効",
      inactive: "無効"
    },
    actions: {
      viewClients: "担当顧客を表示",
      viewDetails: "スタッフ詳細を表示",
      edit: "スタッフを編集",
      disable: "スタッフを無効化",
      activate: "スタッフを有効化"
    },
    confirmStatus: {
      disableTitle: "スタッフを無効化",
      activateTitle: "スタッフを有効化",
      disableWarning: "アカウントが無効の間、このスタッフはログインできません。",
      disableConfirm: "はい、無効化",
      activateConfirm: "はい、有効化",
      cancel: "いいえ",
      disableDescription: "<staffName>{name}</staffName>を<action>無効化</action>してもよろしいですか？",
      activateDescription: "<staffName>{name}</staffName>を<action>有効化</action>してもよろしいですか？"
    },
    error: {
      title: "スタッフ一覧を読み込めません",
      description: "スタッフ一覧の読み込み中にエラーが発生しました。",
      retry: "再試行"
    },
    views: {
      table: "表形式で表示",
      cards: "カード形式で表示",
      swipeHint: "表を横にスワイプすると、ほかの列を確認できます。"
    },
    pagination: {
      itemLabel: "スタッフ"
    },
    notAvailable: "情報なし"
  }
};

function useLocalTranslations() {
  const locale = useLocale();
  return createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
}


// =================================================
// THEME TOKENS
// =================================================

const BRAND = "#107A64";
const BRAND_DARK = "#0C5F4F";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_LINE = "rgba(16, 122, 100, 0.28)";
const BRAND_RING = "rgba(16, 122, 100, 0.55)";

const HAIRLINE = "rgba(17, 24, 39, 0.06)";
const HAIRLINE_STRONG = "rgba(17, 24, 39, 0.14)";

const INK = "#111827";
const INK_MUTED = "#4B5563";
const INK_FAINT = "#6B7280";

const DANGER = "#DC2626";
const DANGER_SOFT = "#FEF2F2";

const SURFACE_TINT = "#FAFAF9";

// Table header (DataGrid column headers)
const HEADER_BG = "#6ec5c2";
const HEADER_INK = "#1F2937";

// =================================================
// RESPONSIVE RULES & CONTAINER QUERIES
// =================================================

// 760px fits standard tablet widths (e.g. iPad portrait 768px)
const GRID_MIN_WIDTH = 760;
const GRID_BUFFER = 20;
const TWO_COLUMN_MIN_WIDTH = 580;
const THREE_COLUMN_MIN_WIDTH = 1100;

const atLeast = (width: number) => `@container staff (min-width: ${width}px)`;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useWideSwitch(min: number, buffer: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [wide, setWide] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = (width: number) =>
      setWide((previous) =>
        width >= min ? true : width < min - buffer ? false : previous,
      );

    update(element.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) =>
      update(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [min, buffer]);

  return [ref, wide] as const;
}

// =================================================
// MOTION
// =================================================

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const reduceMotion = "@media (prefers-reduced-motion: reduce)";

const softCard = {
  borderRadius: { xs: 2.5, sm: 3 },
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(17,24,39,0.03), 0 12px 32px -22px rgba(17,24,39,0.30)",
};

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND_RING}`,
    outlineOffset: 2,
  },
};

// =================================================
// HELPERS
// =================================================

const AVATAR_TONES = [
  { bg: "#E3F2EE", fg: "#0C5F4F" },
  { bg: "#E6EEFB", fg: "#1D4ED8" },
  { bg: "#FDF1DC", fg: "#92580A" },
  { bg: "#EFE8FA", fg: "#6D3FC0" },
  { bg: "#FBE8EC", fg: "#B4234A" },
];

function toneFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

function getInitials(name?: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

// =================================================
// SUBCOMPONENTS
// =================================================

function StaffAvatar({
  name,
  seed,
  size = 38,
}: {
  name?: string | null;
  seed: string;
  size?: number;
}) {
  const tone = toneFor(seed);
  return (
    <Box
      aria-hidden
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        bgcolor: tone.bg,
        color: tone.fg,
        fontSize: Math.max(11, size * 0.36),
        fontWeight: 600,
        letterSpacing: 0.2,
        transition: "transform 220ms ease",
        [reduceMotion]: { transition: "none" },
      }}
    >
      {getInitials(name)}
    </Box>
  );
}

function StaffStatus({ active }: { active: boolean }) {
  const t = useLocalTranslations();
  return (
    <Typography
      component="span"
      sx={{
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        flexShrink: 0,
        color: active ? BRAND_DARK : INK_MUTED,
      }}
    >
      {active ? t("status.active") : t("status.inactive")}
    </Typography>
  );
}

const iconActionSx = {
  color: INK_MUTED,
  minWidth: 34,
  minHeight: 34,
  transition:
    "background-color 200ms ease, color 200ms ease, transform 160ms ease",
  "@media (hover: hover)": {
    "&:hover": {
      bgcolor: BRAND_SOFT,
      color: BRAND,
      transform: "translateY(-1px)",
    },
  },
  "&:active": { transform: "translateY(0)" },
  [reduceMotion]: {
    transition: "none",
    "&:hover": { bgcolor: BRAND_SOFT, color: BRAND, transform: "none" },
  },
  ...focusRing,
};

const labelledButtonBase = {
  flex: 1,
  minWidth: 0,
  minHeight: 36,
  textTransform: "none",
  fontWeight: 600,
  fontSize: 12.5,
  lineHeight: 1.3,
  borderRadius: 2,
  py: 0.6,
  px: 1,
  gap: 0.5,
  transition:
    "background-color 200ms ease, border-color 200ms ease, color 200ms ease, transform 160ms ease",
  "&:active": { transform: "scale(0.98)" },
  [reduceMotion]: { transition: "none", "&:active": { transform: "none" } },
  ...focusRing,
};

type RowActionsProps = {
  row: StaffRecord;
  variant: "icons" | "labelled";
  canManage: boolean;
  busy: boolean;
  onViewClients: (staffId: string) => void;
  onViewDetails: (staffId: string) => void;
  onEdit: (staffId: string) => void;
  onToggleStatus: (row: StaffRecord) => void;
};

function RowActions({
  row,
  variant,
  canManage,
  busy,
  onViewClients,
  onViewDetails,
  onEdit,
  onToggleStatus,
}: RowActionsProps) {
  const t = useLocalTranslations();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const closeMenu = () => setAnchorEl(null);

  const isActive = row.isActive;
  const menuId = `staff-actions-${row.staffId}`;
  const labelled = variant === "labelled";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: labelled ? "stretch" : "flex-end",
        gap: labelled ? 0.75 : 0.25,
        width: labelled ? "100%" : "auto",
        height: labelled ? "auto" : "100%",
      }}
    >
      {labelled ? (
        <>
          <Button
            variant="text"
            disableElevation
            onClick={() => onViewDetails(row.staffId)}
            sx={{
              ...labelledButtonBase,
              color: BRAND_DARK,
              bgcolor: BRAND_SOFT,
              "@media (hover: hover)": {
                "&:hover": { bgcolor: "rgba(16, 122, 100, 0.14)" },
              },
            }}
          >
            <Typography
              component="span"
              noWrap
              sx={{ fontSize: "inherit", fontWeight: "inherit" }}
            >
              {t("actions.viewDetails")}
            </Typography>
          </Button>

          <Button
            variant="outlined"
            onClick={() => onViewClients(row.staffId)}
            sx={{
              ...labelledButtonBase,
              color: INK,
              borderColor: HAIRLINE_STRONG,
              "@media (hover: hover)": {
                "&:hover": {
                  borderColor: BRAND,
                  bgcolor: BRAND_SOFT,
                  color: BRAND_DARK,
                },
              },
            }}
          >
            <Typography
              component="span"
              noWrap
              sx={{ fontSize: "inherit", fontWeight: "inherit" }}
            >
              {t("actions.viewClients")}
            </Typography>
          </Button>
        </>
      ) : (
        <>
          <Tooltip title={t("actions.viewClients")}>
            <IconButton
              aria-label={t("actions.viewClients")}
              size="small"
              sx={iconActionSx}
              onClick={() => onViewClients(row.staffId)}
            >
              <PersonSearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("actions.viewDetails")}>
            <IconButton
              aria-label={t("actions.viewDetails")}
              size="small"
              sx={iconActionSx}
              onClick={() => onViewDetails(row.staffId)}
            >
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}

      {canManage && (
        <>
          <Tooltip title={t("columns.action")}>
            <span>
              <IconButton
                aria-label={t("columns.action")}
                aria-haspopup="menu"
                aria-controls={anchorEl ? menuId : undefined}
                aria-expanded={anchorEl ? "true" : undefined}
                size="small"
                disabled={busy}
                onClick={(event) => setAnchorEl(event.currentTarget)}
                sx={{
                  ...iconActionSx,
                  ...(labelled && {
                    border: `1px solid ${HAIRLINE_STRONG}`,
                    borderRadius: 2,
                    minWidth: 36,
                    minHeight: 36,
                  }),
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  mt: 0.5,
                  minWidth: 190,
                  borderRadius: 2.5,
                  border: `1px solid ${HAIRLINE}`,
                  boxShadow: "0 16px 40px -16px rgba(17,24,39,0.25)",
                  "& .MuiMenuItem-root": {
                    gap: 0.5,
                    py: 1.1,
                    mx: 0.75,
                    borderRadius: 1.75,
                  },
                  "& .MuiListItemText-primary": {
                    fontSize: 13.5,
                    fontWeight: 500,
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: 32,
                    color: "inherit",
                  },
                },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                closeMenu();
                onEdit(row.staffId);
              }}
              sx={{ color: INK }}
            >
              <ListItemIcon>
                <EditOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("actions.edit")}</ListItemText>
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              disabled={busy}
              onClick={() => {
                closeMenu();
                onToggleStatus(row);
              }}
              sx={{
                color: isActive ? DANGER : BRAND_DARK,
                "@media (hover: hover)": {
                  "&:hover": { bgcolor: isActive ? DANGER_SOFT : BRAND_SOFT },
                },
              }}
            >
              <ListItemIcon>
                {isActive ? (
                  <PersonOffOutlinedIcon fontSize="small" />
                ) : (
                  <PersonAddOutlinedIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText>
                {isActive ? t("actions.disable") : t("actions.activate")}
              </ListItemText>
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
}

// =================================================
// CARD LIST (Responsive Cards)
// =================================================

const listSx = {
  m: 0,
  p: { xs: 1.25, sm: 1.5, md: 2 },
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: { xs: 1.25, sm: 1.5, md: 2 },
  bgcolor: SURFACE_TINT,
  [atLeast(TWO_COLUMN_MIN_WIDTH)]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  [atLeast(THREE_COLUMN_MIN_WIDTH)]: {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
};

const listRowSx = {
  listStyle: "none",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minWidth: 0,
  p: { xs: 1.5, sm: 1.75 },
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 2.5,
  bgcolor: "#ffffff",
  gap: 1.25,
};

const cardEffectsSx = {
  overflow: "hidden",
  transition:
    "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
  "&::before": {
    content: '""',
    position: "absolute",
    insetBlock: 0,
    left: 0,
    width: 3.5,
    bgcolor: BRAND,
    opacity: 0,
    transition: "opacity 200ms ease",
  },
  "@media (hover: hover)": {
    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: BRAND_LINE,
      boxShadow: "0 10px 24px -14px rgba(16, 122, 100, 0.4)",
    },
    "&:hover::before": { opacity: 1 },
  },
  [reduceMotion]: {
    animation: "none",
    transition: "none",
    "&:hover": { transform: "none" },
  },
};

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component="dt"
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: INK_FAINT,
          textTransform: "uppercase",
          letterSpacing: 0.3,
          lineHeight: 1.3,
        }}
      >
        {label}
      </Typography>
      <Typography
        component="dd"
        noWrap
        title={value}
        sx={{
          m: 0,
          mt: 0.25,
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.35,
          color: INK,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function StaffListItem({
  row,
  index,
  ...actions
}: { row: StaffRecord; index: number } & Omit<
  RowActionsProps,
  "row" | "variant"
>) {
  const t = useLocalTranslations();

  return (
    <Box
      component="li"
      sx={{
        ...listRowSx,
        ...cardEffectsSx,
        animation: `${fadeUp} 280ms ease both`,
        animationDelay: `${Math.min(index, 6) * 35}ms`,
      }}
    >
      {/* Top row: Avatar + Name/Email + Status */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
        <StaffAvatar name={row.name} seed={row.staffId} size={40} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mb: 0.25,
            }}
          >
            <Typography
              noWrap
              title={row.name || "-"}
              sx={{
                fontSize: 14.5,
                fontWeight: 600,
                lineHeight: 1.3,
                color: INK,
              }}
            >
              {row.name || "-"}
            </Typography>
            <StaffStatus active={row.isActive} />
          </Box>
          <Typography
            noWrap
            title={row.email || "-"}
            sx={{
              fontSize: 12.5,
              lineHeight: 1.35,
              color: INK_MUTED,
            }}
          >
            {row.email || "-"}
          </Typography>
        </Box>
      </Box>

      {/* Middle row: Clean structured metadata */}
      <Box
        component="dl"
        sx={{
          m: 0,
          py: 1.25,
          borderTop: `1px solid ${HAIRLINE}`,
          borderBottom: `1px solid ${HAIRLINE}`,
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" },
          gap: 1,
        }}
      >
        <MetaItem label={t("columns.id")} value={row.staffId} />
        <MetaItem
          label={t("columns.location")}
          value={translateLocation(row.location, t)}
        />
        <Box sx={{ gridColumn: { xs: "span 2", sm: "span 1" } }}>
          <MetaItem
            label={t("columns.createdAt")}
            value={formatStaffCreatedAt(row.createdAt, t)}
          />
        </Box>
      </Box>

      {/* Bottom row: Touch-ready action buttons */}
      <RowActions row={row} variant="labelled" {...actions} />
    </Box>
  );
}

function StaffListSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Box key={index} component="li" sx={listRowSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="55%" height={18} />
              <Skeleton width="75%" height={16} />
            </Box>
            <Skeleton variant="rounded" width={64} height={22} />
          </Box>
          <Skeleton variant="rounded" height={36} />
        </Box>
      ))}
    </>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const t = useLocalTranslations();
  return (
    <Box
      role="alert"
      sx={{
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 0.75,
        px: 3,
        py: 5,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: INK }}>
        {t("error.title")}
      </Typography>
      <Typography sx={{ fontSize: 13.5, color: INK_MUTED, maxWidth: 360 }}>
        {t("error.description")}
      </Typography>
      <Button
        variant="outlined"
        onClick={onRetry}
        sx={{
          mt: 1.5,
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 2,
          color: INK,
          borderColor: HAIRLINE_STRONG,
          "&:hover": {
            borderColor: BRAND,
            bgcolor: BRAND_SOFT,
            color: BRAND_DARK,
          },
          ...focusRing,
        }}
      >
        {t("error.retry")}
      </Button>
    </Box>
  );
}

// =================================================
// MAIN PAGE COMPONENT
// =================================================

export default function StaffPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useLocalTranslations();
  const role = useAuthStore((state) => state.user?.role);
  const canManage = role === "superadmin";

  // Measured width switch: auto switches layout
  const [cardRef, isWideScreen] = useWideSwitch(GRID_MIN_WIDTH, GRID_BUFFER);
  // Manual override toggle: user can pick "table" or "cards" at any viewport
  const [viewMode, setViewMode] = useState<"table" | "cards" | "auto">("auto");
  const isGrid = viewMode === "auto" ? isWideScreen : viewMode === "table";

  const mainRef = useRef<HTMLElement | null>(null);

  const {
    isLoading,
    isError,
    refetch,
    staffData,
    pagination,
    staffFilters,
    staffOptions,
    onPageChange,
    handleStaffSearch,
    handleStaffFilterReset,
    updateStaffStatus,
    isUpdatingStatus,
  } = useStaffHook();

  const rows = staffData;

  const staffFilterFields: FilterField<StaffFilterValues>[] = [
    {
      type: "select",
      name: "staffId",
      label: t("filters.staffMember.label"),
      placeholder: t("filters.staffMember.placeholder"),
      options: staffOptions,
    },
    {
      type: "select",
      name: "location",
      label: t("filters.location.label"),
      placeholder: t("filters.location.placeholder"),
      options: (["USA", "Japan", "Nepal", "Other"] as const).map((value) => ({
        label: t(`filters.location.options.${value}`),
        value,
      })),
    },
    {
      type: "select",
      name: "isActive",
      label: t("filters.accountStatus.label"),
      placeholder: t("filters.accountStatus.placeholder"),
      options: [
        { label: t("filters.accountStatus.options.active"), value: "true" },
        { label: t("filters.accountStatus.options.inactive"), value: "false" },
      ],
    },
  ];

  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    staffId: string;
    name: string;
    isActive: boolean;
  }>({
    open: false,
    staffId: "",
    name: "",
    isActive: false,
  });

  const closeStatusDialog = () => {
    setStatusDialog({
      open: false,
      staffId: "",
      name: "",
      isActive: false,
    });
  };

  const handleConfirmStatusChange = () => {
    updateStaffStatus(
      {
        staffId: statusDialog.staffId,
        isActive: !statusDialog.isActive,
      },
      {
        onSuccess: () => {
          closeStatusDialog();
        },
      },
    );
  };

  const openStatusDialog = (row: StaffRecord) =>
    setStatusDialog({
      open: true,
      staffId: row.staffId,
      name: row.name || t("thisStaffMember"),
      isActive: row.isActive,
    });

  const handlePageChange: typeof onPageChange = (...args) => {
    onPageChange(...args);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showError = isError && !isLoading && rows.length === 0;

  const rowActionHandlers = {
    canManage,
    busy: isUpdatingStatus,
    onViewClients: (id: string) => router.push(`/admin/staff/${id}/clients`),
    onViewDetails: (id: string) => router.push(`/admin/staff/${id}`),
    onEdit: (id: string) => router.push(`/admin/staff/${id}/edit`),
    onToggleStatus: openStatusDialog,
  };

  // -----------------------------------------------
  // DataGrid columns (Optimized for Tablet & Desktop)
  // -----------------------------------------------

  const baseColumn = { resizable: false, disableColumnMenu: true } as const;

  const columns: GridColDef[] = [
    {
      ...baseColumn,
      field: "name",
      headerName: t("columns.fullName"),
      flex: 1.3,
      minWidth: 190,
      renderCell: (params) => {
        const row = params.row as StaffRecord;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              minWidth: 0,
            }}
          >
            <StaffAvatar name={row.name} seed={row.staffId} size={34} />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: INK,
                  lineHeight: 1.35,
                }}
              >
                {row.name || "-"}
              </Typography>
              <Typography
                noWrap
                sx={{ fontSize: 12, color: INK_MUTED, lineHeight: 1.35 }}
              >
                {row.email || "-"}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      ...baseColumn,
      field: "staffId",
      headerName: t("columns.id"),
      flex: 0.6,
      minWidth: 95,
      renderCell: (params) => (
        <Typography
          noWrap
          sx={{
            fontSize: 12.5,
            fontWeight: 600,
            fontFamily: "monospace",
            color: INK,
            bgcolor: "rgba(17, 24, 39, 0.04)",
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      ...baseColumn,
      field: "location",
      headerName: t("columns.location"),
      flex: 0.6,
      minWidth: 95,
      renderCell: (params) => (
        <Typography noWrap sx={{ fontSize: 13.5, color: INK_MUTED }}>
          {translateLocation(params.value, t)}
        </Typography>
      ),
    },
    {
      ...baseColumn,
      field: "isActive",
      headerName: t("columns.status"),
      width: 110,
      renderCell: (params) => <StaffStatus active={Boolean(params.value)} />,
    },
    {
      ...baseColumn,
      field: "createdAt",
      headerName: t("columns.createdAt"),
      flex: 0.75,
      minWidth: 125,
      valueGetter: (_value, row) => formatStaffCreatedAt(row.createdAt, t),
      renderCell: (params) => (
        <Typography noWrap sx={{ fontSize: 13, color: INK_MUTED }}>
          {params.value}
        </Typography>
      ),
    },
    {
      ...baseColumn,
      field: "actions",
      headerName: t("columns.action"),
      width: canManage ? 116 : 84,
      align: "right",
      headerAlign: "right",
      sortable: false,
      renderCell: (params) => (
        <RowActions
          row={params.row as StaffRecord}
          variant="icons"
          {...rowActionHandlers}
        />
      ),
    },
  ];

  // -----------------------------------------------
  // Render
  // -----------------------------------------------

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        "@supports (height: 100dvh)": { height: "100dvh" },
        overflow: "hidden",
        bgcolor: "#F7F8F6",
      }}
    >
      <Box
        component="main"
        ref={mainRef}
        sx={{
          height: "100%",
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          px: { xs: 1.5, sm: 2.5, md: 3 },
          py: { xs: 1.75, sm: 2.5, md: 3 },
        }}
      >
        <Box sx={{ maxWidth: 1320, mx: "auto" }}>
          {/* BREADCRUMB */}
          <Box
            sx={{
              mb: { xs: 1, md: 1.5 },
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Breadcrumb
              items={[
                { label: t("breadcrumbs.dashboard"), href: "/admin/dashboard" },
                {
                  label: t("breadcrumbs.staff"),
                  href: "/admin/staff",
                  current: true,
                },
              ]}
            />
          </Box>

          {/* HEADER */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: { xs: 1.5, sm: 2 },
              mb: { xs: 2, md: 2.5 },
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 21, sm: 24, md: 26 },
                  fontWeight: 700,
                  letterSpacing: -0.4,
                  lineHeight: 1.25,
                  color: INK,
                }}
              >
                {t("title")}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: { xs: 13, sm: 13.5 },
                  lineHeight: 1.45,
                  color: INK_MUTED,
                  maxWidth: 620,
                }}
              >
                {t("description")}
              </Typography>
            </Box>

            {canManage && (
              <Button
                variant="contained"
                disableElevation
                startIcon={<PersonAddAlt1OutlinedIcon sx={{ fontSize: 18 }} />}
                onClick={() => router.push("/admin/staff/add")}
                sx={{
                  flexShrink: 0,
                  alignSelf: { xs: "flex-start", sm: "center" },
                  minHeight: 38,
                  px: { xs: 1.75, sm: 2.25 },
                  py: 0.6,
                  borderRadius: 999,
                  textTransform: "none",
                  fontSize: 13.5,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  color: "#ffffff",
                  background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                  boxShadow: "0 6px 14px -6px rgba(16, 122, 100, 0.75)",
                  transition:
                    "transform 180ms ease, box-shadow 220ms ease, filter 200ms ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    filter: "brightness(1.06)",
                    boxShadow: "0 10px 20px -8px rgba(16, 122, 100, 0.85)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  [reduceMotion]: {
                    transition: "none",
                    "&:hover": { transform: "none" },
                  },
                  ...focusRing,
                }}
              >
                {t("addStaff")}
              </Button>
            )}
          </Box>

          {/* FILTERS */}
          <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <SearchFilter<StaffFilterValues>
              key={JSON.stringify(staffFilters)}
              searchField={{
                name: "keyword",
                label: t("filters.search.label"),
                placeholder: t("filters.search.placeholder"),
              }}
              fields={staffFilterFields}
              initialValues={staffFilters}
              onSearch={handleStaffSearch}
              onReset={handleStaffFilterReset}
              searchButtonText={t("filters.searchButton")}
              resetButtonText={t("filters.clearButton")}
              isLoading={isLoading}
            />
          </Box>

          {/* TABLE / LIST WRAPPER */}
          <Paper
            ref={cardRef}
            elevation={0}
            sx={{
              ...softCard,
              overflow: "hidden",
              containerType: "inline-size",
              containerName: "staff",
            }}
          >
            {/* TOOLBAR: ROWS COUNT & VIEW MODE SWITCHER */}
            <Box
              sx={{
                px: { xs: 1.75, sm: 2.5 },
                py: 1.25,
                borderBottom: `1px solid ${HAIRLINE}`,
                bgcolor: SURFACE_TINT,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.25,
              }}
            >
              <PaginationRowsLabel
                count={pagination?.total ?? 0}
                from={pagination?.from ?? null}
                to={pagination?.to ?? null}
                itemLabel={t("pagination.itemLabel")}
              />

              {/* View Switcher: allows user to toggle Table / Card mode on any screen */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  p: 0.35,
                  borderRadius: 2,
                  bgcolor: "rgba(17, 24, 39, 0.05)",
                  border: `1px solid ${HAIRLINE}`,
                }}
              >
                <Tooltip title={t("views.table")}>
                  <IconButton
                    size="small"
                    aria-label={t("views.table")}
                    onClick={() => setViewMode("table")}
                    sx={{
                      p: 0.6,
                      borderRadius: 1.5,
                      color: isGrid ? BRAND_DARK : INK_FAINT,
                      bgcolor: isGrid ? "#ffffff" : "transparent",
                      boxShadow: isGrid
                        ? "0 1px 3px rgba(0,0,0,0.08)"
                        : "none",
                      "&:hover": {
                        bgcolor: isGrid
                          ? "#ffffff"
                          : "rgba(17,24,39,0.04)",
                      },
                    }}
                  >
                    <TableRowsOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("views.cards")}>
                  <IconButton
                    size="small"
                    aria-label={t("views.cards")}
                    onClick={() => setViewMode("cards")}
                    sx={{
                      p: 0.6,
                      borderRadius: 1.5,
                      color: !isGrid ? BRAND_DARK : INK_FAINT,
                      bgcolor: !isGrid ? "#ffffff" : "transparent",
                      boxShadow: !isGrid
                        ? "0 1px 3px rgba(0,0,0,0.08)"
                        : "none",
                      "&:hover": {
                        bgcolor: !isGrid
                          ? "#ffffff"
                          : "rgba(17,24,39,0.04)",
                      },
                    }}
                  >
                    <GridViewOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* TABLE HORIZONTAL SCROLL HINT (Shown on smaller screens in table mode) */}
            {isGrid && !showError && (
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 0.6,
                  px: 2,
                  py: 0.6,
                  bgcolor: "rgba(16, 122, 100, 0.03)",
                  borderBottom: `1px solid ${HAIRLINE}`,
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: INK_FAINT,
                }}
              >
                <SwapHorizIcon sx={{ fontSize: 15, color: BRAND }} />
                <span>{t("views.swipeHint")}</span>
              </Box>
            )}

            {/* DATA VIEW (DataGrid or Cards) */}
            {showError ? (
              <ErrorState onRetry={() => void refetch()} />
            ) : isGrid ? (
              <DataGrid
                localeText={
                  (locale === "ja" ? jaJP : enUS).components.MuiDataGrid.defaultProps.localeText
                }
                rows={rows}
                getRowId={(row) => row.staffId}
                columns={columns}
                disableColumnMenu
                disableRowSelectionOnClick
                slots={{ noRowsOverlay: NoDataOverlay }}
                loading={isLoading}
                hideFooter
                autoHeight
                rowHeight={56}
                columnHeaderHeight={42}
                sx={{
                  border: "none",
                  "--DataGrid-containerBackground": HEADER_BG,
                  "--DataGrid-rowBorderColor": HAIRLINE,

                  "& .MuiDataGrid-virtualScroller": {
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch",
                    "&::-webkit-scrollbar": {
                      height: 6,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      borderRadius: 3,
                      bgcolor: "rgba(17, 24, 39, 0.16)",
                      "&:hover": { bgcolor: "rgba(17, 24, 39, 0.28)" },
                    },
                  },

                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: HEADER_BG,
                    borderBottom: `1px solid ${HAIRLINE}`,
                  },
                  "& .MuiDataGrid-columnHeader": {
                    bgcolor: HEADER_BG,
                    "&:focus, &:focus-within": { outline: "none" },
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontSize: 12.5,
                    fontWeight: 700,
                    letterSpacing: 0.2,
                    color: HEADER_INK,
                    textTransform: "uppercase",
                  },
                  "& .MuiDataGrid-columnSeparator": { display: "none" },

                  "& .MuiDataGrid-cell": {
                    display: "flex",
                    alignItems: "center",
                    borderBottomColor: HAIRLINE,
                    "&:focus, &:focus-within": { outline: "none" },
                  },
                  "& .MuiDataGrid-cell[data-colindex='0'], & .MuiDataGrid-columnHeader[aria-colindex='1']":
                    { pl: { xs: 1.5, sm: 2.5 } },
                  "& .MuiDataGrid-cell[data-field='actions'], & .MuiDataGrid-columnHeader[data-field='actions']":
                    { pr: { xs: 1.5, sm: 2 } },

                  "& .MuiDataGrid-row": {
                    transition:
                      "background-color 180ms ease, box-shadow 180ms ease",
                    [reduceMotion]: { transition: "none" },
                    "@media (hover: hover)": {
                      "&:hover": {
                        bgcolor: "rgba(16, 122, 100, 0.04)",
                        boxShadow: `inset 3px 0 0 ${BRAND}`,
                      },
                    },
                  },
                  "& .MuiDataGrid-row:last-of-type .MuiDataGrid-cell": {
                    borderBottom: 0,
                  },
                }}
              />
            ) : (
              <Box
                component="ul"
                aria-busy={isLoading}
                sx={{
                  ...listSx,
                  opacity: isLoading && rows.length > 0 ? 0.55 : 1,
                  pointerEvents: isLoading && rows.length > 0 ? "none" : "auto",
                  transition: "opacity 150ms ease",
                }}
              >
                {isLoading && rows.length === 0 ? (
                  <StaffListSkeleton />
                ) : rows.length === 0 ? (
                  <Box
                    component="li"
                    sx={{
                      listStyle: "none",
                      gridColumn: "1 / -1",
                      position: "relative",
                      minHeight: 260,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <NoDataOverlay />
                  </Box>
                ) : (
                  rows.map((row, index) => (
                    <StaffListItem
                      key={row.staffId}
                      row={row}
                      index={index}
                      {...rowActionHandlers}
                    />
                  ))
                )}
              </Box>
            )}

            {/* PAGINATION FOOTER */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: { xs: "center", sm: "flex-end" },
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
                overflowX: "auto",
                px: { xs: 1.5, sm: 2.5 },
                py: 1.25,
                borderTop: `1px solid ${HAIRLINE}`,
                bgcolor: SURFACE_TINT,
              }}
            >
              <Pagination
                page={pagination?.current_page ?? 1}
                total={pagination?.total ?? 0}
                pageSize={pagination?.per_page ?? 10}
                disabled={isLoading}
                onPageChange={handlePageChange}
              />
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* CONFIRMATION DIALOG */}
      <ConfirmActionDialog
        open={statusDialog.open}
        title={
          statusDialog.isActive
            ? t("confirmStatus.disableTitle")
            : t("confirmStatus.activateTitle")
        }
        description={
          <>
            {t.rich(
              statusDialog.isActive
                ? "confirmStatus.disableDescription"
                : "confirmStatus.activateDescription",
              {
                name: statusDialog.name,
                action: (chunks) => <strong>{chunks}</strong>,
                staffName: (chunks) => <strong>{chunks}</strong>,
              },
            )}
            {statusDialog.isActive && (
              <div style={{ marginTop: 12 }}>
                {t("confirmStatus.disableWarning")}
              </div>
            )}
          </>
        }
        confirmText={
          statusDialog.isActive
            ? t("confirmStatus.disableConfirm")
            : t("confirmStatus.activateConfirm")
        }
        cancelText={t("confirmStatus.cancel")}
        confirmColor={statusDialog.isActive ? "error" : "success"}
        isLoading={isUpdatingStatus}
        onConfirm={handleConfirmStatusChange}
        onClose={closeStatusDialog}
      />
    </Box>
  );
}

function translateLocation(
  value: string | null | undefined,
  t: ReturnType<typeof useLocalTranslations>,
) {
  const location = (["USA", "Japan", "Nepal", "Other"] as const).find(
    (location) => location === value,
  );
  return location ? t(`filters.location.options.${location}`) : value || "-";
}

function formatStaffCreatedAt(
  value: string | null | undefined,
  t: ReturnType<typeof useLocalTranslations>,
) {
  const formatted = formatCreatedAt(value);
  return formatted === "N/A" ? t("notAvailable") : formatted;
}
