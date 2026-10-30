"use client";

import MuiPagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import type { ChangeEvent } from "react";
import { createTranslator, useLocale } from "next-intl";

const messages = {
  en: {
    navigation: "Pagination navigation",
    page: "Go to page {page, number}",
    currentPage: "Page {page, number}, current page",
    first: "Go to first page",
    last: "Go to last page",
    next: "Go to next page",
    previous: "Go to previous page",
    ellipsis: "More pages",
  },
  ja: {
    navigation: "ページ切り替え",
    page: "{page, number}ページ目へ",
    currentPage: "現在のページ：{page, number}ページ目",
    first: "最初のページへ",
    last: "最後のページへ",
    next: "次のページへ",
    previous: "前のページへ",
    ellipsis: "ほかのページ",
  },
};

type PaginationProps = {
  page: number;
  total: number;
  pageSize: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  total,
  pageSize,
  disabled = false,
  onPageChange,
}: PaginationProps) {
  const locale = useLocale();
  const t = createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), pageCount);

  const handleChange = (_event: ChangeEvent<unknown>, nextPage: number) => {
    onPageChange(nextPage);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-end" } }}>
      <MuiPagination
        aria-label={t("navigation")}
        getItemAriaLabel={(type, itemPage, selected) => {
          if (type === "page") {
            return t(selected ? "currentPage" : "page", { page: itemPage ?? 1 });
          }
          if (type === "start-ellipsis" || type === "end-ellipsis") {
            return t("ellipsis");
          }
          return t(type);
        }}
        count={pageCount}
        page={currentPage}
        onChange={handleChange}
        disabled={disabled || total === 0}
        variant="outlined"
        shape="rounded"
        showFirstButton
        showLastButton
        siblingCount={0}
        boundaryCount={1}
        sx={{
          "& .MuiPaginationItem-root": {
            borderColor: "#D1D5DB",
            color: "#374151",
            fontWeight: 600,
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            bgcolor: "#107A64",
            borderColor: "#107A64",
            color: "#FFFFFF",
            "&:hover": { bgcolor: "#0C5F4F" },
          },
        }}
      />
    </Box>
  );
}
