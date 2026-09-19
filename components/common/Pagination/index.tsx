"use client";

import MuiPagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import type { ChangeEvent } from "react";

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
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), pageCount);

  const handleChange = (_event: ChangeEvent<unknown>, nextPage: number) => {
    onPageChange(nextPage);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-end" } }}>
      <MuiPagination
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
