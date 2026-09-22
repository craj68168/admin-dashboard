"use client";

import { useMemo, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";
import toast from "react-hot-toast";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

import type {
  DeleteStagePayload,
  StageFilterValues,
  StageListQuery,
  StageListResponse,
  StageRecord,
} from "./type";

// =================================================
// CONFIG
// =================================================

const DEFAULT_PAGE_SIZE = 10;

// =================================================
// QUERY KEY
// =================================================

export const STAGE_QUERY_KEY = ["stages"] as const;

// =================================================
// POSITIVE INTEGER
// =================================================

const readPositiveInteger = (
  value: string | null,
  fallback: number,
) => {
  const parsed = Number.parseInt(value ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : fallback;
};

// =================================================
// API
// =================================================

const getStages = async (
  includeInactive: boolean,
): Promise<StageRecord[]> => {
  const response = await api.get<StageListResponse>(
    "/stages",
    {
      params: {
        ...(includeInactive && {
          includeInactive: true,
        }),
      },
    },
  );

  return Array.isArray(response.data?.data)
    ? response.data.data
    : [];
};

// =================================================
// DELETE
// =================================================

const deleteStage = async ({
  stageId,
}: DeleteStagePayload): Promise<void> => {
  await api.delete(`/stages/${stageId}`);
};

// =================================================
// HOOK
// =================================================

export function useStageHook() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const role = useAuthStore(
    (state) => state.user?.role,
  );

  const isSuperAdmin = role === "superadmin";

  // =================================================
  // URL QUERY
  // =================================================

const stageQuery = useMemo<StageListQuery>(
  () => ({
    keyword: searchParams.get("keyword") ?? "",

    page: readPositiveInteger(
      searchParams.get("page"),
      1,
    ),

    limit: readPositiveInteger(
      searchParams.get("limit"),
      DEFAULT_PAGE_SIZE,
    ),
  }),
  [searchParams],
);

  // =================================================
  // FILTER VALUES
  // =================================================

const stageFilters = useMemo<StageFilterValues>(
  () => ({
    keyword: stageQuery.keyword,
  }),
  [stageQuery.keyword],
);

  // =================================================
  // APPLY URL QUERY
  // Same architecture as Client List
  // =================================================

  const applyQuery = (
    nextQuery: StageListQuery,
  ) => {
    const params = new URLSearchParams();

    Object.entries(nextQuery).forEach(
      ([key, value]) => {
        if (
          value !== "" &&
          value !== undefined &&
          value !== null
        ) {
          params.set(key, String(value));
        }
      },
    );

    const queryString = params.toString();

    router.replace(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
    );
  };

  // =================================================
  // DELETE DIALOG
  // =================================================

  const [stageToDelete, setStageToDelete] =
    useState<StageRecord | null>(null);

  // =================================================
  // GET STAGES
  // =================================================

  const {
    data: stages = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      ...STAGE_QUERY_KEY,
      {
        includeInactive: isSuperAdmin,
      },
    ],

    queryFn: () =>
      getStages(isSuperAdmin),
  });

  // =================================================
  // SEARCH / FILTER
  // =================================================

const filteredStages = useMemo(() => {
  const keyword = stageQuery.keyword
    .trim()
    .toLowerCase();

  if (!keyword) {
    return stages;
  }

  return stages.filter((stage) => {
    const matchesText =
      stage.stageId
        .toLowerCase()
        .includes(keyword) ||

      stage.name
        .toLowerCase()
        .includes(keyword) ||

      stage.key
        .toLowerCase()
        .includes(keyword) ||

      String(stage.amount)
        .includes(keyword) ||

      stage.amount
        .toLocaleString()
        .includes(keyword) ||

      String(stage.displayOrder)
        .includes(keyword) ||

      (stage.createdByName ?? "")
        .toLowerCase()
        .includes(keyword) ||

      (stage.updatedByName ?? "")
        .toLowerCase()
        .includes(keyword);

    const matchesStatus =
      (keyword === "active" && stage.isActive) ||
      (keyword === "inactive" && !stage.isActive);

    const matchesType =
      (keyword === "system" && stage.isSystem) ||
      (keyword === "custom" && !stage.isSystem);

    return (
      matchesText ||
      matchesStatus ||
      matchesType
    );
  });
}, [stages, stageQuery.keyword]);

  // =================================================
  // PAGINATION
  // =================================================

  const pagination = useMemo(() => {
    const total = filteredStages.length;

    const totalPages = Math.max(
      1,
      Math.ceil(
        total / stageQuery.limit,
      ),
    );

    const currentPage = Math.min(
      stageQuery.page,
      totalPages,
    );

    const startIndex =
      (currentPage - 1) *
      stageQuery.limit;

    const endIndex =
      startIndex +
      stageQuery.limit;

    const from =
      total === 0
        ? null
        : startIndex + 1;

    const to =
      total === 0
        ? null
        : Math.min(
            endIndex,
            total,
          );

    return {
      current_page: currentPage,
      per_page: stageQuery.limit,
      total,
      from,
      to,
      total_pages: totalPages,
    };
  }, [
    filteredStages.length,
    stageQuery.page,
    stageQuery.limit,
  ]);

  // =================================================
  // CURRENT PAGE DATA
  // =================================================

  const stageData = useMemo(() => {
    const start =
      (pagination.current_page - 1) *
      pagination.per_page;

    const end =
      start +
      pagination.per_page;

    return filteredStages.slice(
      start,
      end,
    );
  }, [
    filteredStages,
    pagination.current_page,
    pagination.per_page,
  ]);

  // =================================================
  // PAGE CHANGE
  // =================================================

  const onPageChange = (
    page: number,
    limit = stageQuery.limit,
  ) => {
    applyQuery({
      ...stageQuery,
      page,
      limit,
    });
  };

  // =================================================
  // SEARCH
  // =================================================

  const handleStageSearch = (
    values: StageFilterValues,
  ) => {
    applyQuery({
      ...values,
      page: 1,
      limit: stageQuery.limit,
    });
  };

  // =================================================
  // RESET
  // =================================================

 const handleStageFilterReset = () => {
  applyQuery({
    keyword: "",
    page: 1,
    limit: stageQuery.limit,
  });
};

  // =================================================
  // DELETE
  // =================================================

  const deleteMutation = useMutation({
    mutationFn: deleteStage,

    onSuccess: async () => {
      setStageToDelete(null);

      toast.success(
        "Stage deleted successfully",
      );

      await queryClient.invalidateQueries({
        queryKey: STAGE_QUERY_KEY,
      });
    },

    onError: (error: unknown) => {
      console.error(
        "Failed to delete stage:",
        error,
      );

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        toast.error(
          message ||
            "Failed to delete stage",
        );

        return;
      }

      toast.error(
        "Failed to delete stage",
      );
    },
  });

  // =================================================
  // NAVIGATION
  // =================================================

  const handleAddStage = () => {
    router.push("/admin/stages/add");
  };

  const handleEditStage = (
    stageId: string,
  ) => {
    router.push(
      `/admin/stages/${stageId}/edit`,
    );
  };

  // =================================================
  // DELETE DIALOG
  // =================================================

  const handleOpenDeleteDialog = (
    stage: StageRecord,
  ) => {
    setStageToDelete(stage);
  };

  const handleCloseDeleteDialog = () => {
    if (deleteMutation.isPending) {
      return;
    }

    setStageToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!stageToDelete?.stageId) {
      toast.error(
        "Stage ID is missing",
      );

      return;
    }

    deleteMutation.mutate({
      stageId: stageToDelete.stageId,
    });
  };

  // =================================================
  // RETURN
  // =================================================

  return {
    // data
    stages,
    stageData,

    // filters
    stageFilters,
    handleStageSearch,
    handleStageFilterReset,

    // pagination
    pagination,
    onPageChange,

    // permission
    isSuperAdmin,

    // query
    isLoading,
    isFetching,
    isError,
    refetch,

    // navigation
    handleAddStage,
    handleEditStage,

    // delete
    stageToDelete,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    isDeleting: deleteMutation.isPending,
  };
}