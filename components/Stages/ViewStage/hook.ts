"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

import type {
  StageListResponse,
  StageRecord,
} from "../type";

// =================================================
// API
// =================================================

const getStage = async (
  stageId: string,
  includeInactive: boolean,
): Promise<StageRecord | null> => {
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

  const stages = Array.isArray(response.data?.data)
    ? response.data.data
    : [];

  return (
    stages.find(
      (stage) => stage.stageId === stageId,
    ) ?? null
  );
};

// =================================================
// HOOK
// =================================================

export function useViewStageHook() {
  const router = useRouter();
  const params = useParams();

  const role = useAuthStore(
    (state) => state.user?.role,
  );

  const isSuperAdmin =
    role === "superadmin";

  const stageId =
    typeof params.stageId === "string"
      ? params.stageId
      : "";

  // =================================================
  // GET STAGE
  // =================================================

  const {
    data: stage = null,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "stage",
      "view",
      stageId,
      {
        includeInactive: isSuperAdmin,
      },
    ],

    queryFn: () =>
      getStage(
        stageId,
        isSuperAdmin,
      ),

    enabled: Boolean(stageId),
  });

  // =================================================
  // NAVIGATION
  // =================================================

  const handleBack = () => {
    router.push("/admin/stages");
  };

  const handleEdit = () => {
    if (!stageId) {
      return;
    }

    router.push(
      `/admin/stages/${stageId}/edit`,
    );
  };

  // =================================================
  // RETURN
  // =================================================

  return {
    stageId,
    stage,

    isLoading,
    isFetching,
    isError,
    refetch,

    handleBack,
    handleEdit,
  };
}