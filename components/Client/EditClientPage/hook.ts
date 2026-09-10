"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientFormDefaults, getClientFormFields } from "@/components/ReusableForm/form-configs";
import { getApiErrorMessage } from "@/lib/api-message";
import { api } from "@/lib/axios";
import { canAssignClient, canEditClient } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";
import {
  compactPayload,
  getClientList,
  invalidateClientData,
} from "../client-query";
import type {
  ClientListApiResponse,
  ClientRecord,
  ClientStaffRecord,
  EditClientViewState,
} from "./type";

function formatInputDate(value?: string) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

function buildRemarksValue({
  existingRemarks,
  remarksDate,
  remarksBy,
  remarksText,
}: {
  existingRemarks?: string;
  remarksDate?: string;
  remarksBy?: string;
  remarksText?: string;
}) {
  const text = remarksText?.trim();

  if (!text) {
    return existingRemarks;
  }

  const newRemark = [
    `[${remarksDate || "No date"} - Japan Time]`,
    `By: ${remarksBy || "Current Staff"}`,
    text,
  ].join("\n");

  return existingRemarks ? `${existingRemarks}\n\n${newRemark}` : newRemark;
}

function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      payload,
    }: {
      clientId: number | string;
      payload: Record<string, string | number | undefined>;
    }) => api.patch(`/clients/${clientId}`, payload),
    onSuccess: () => invalidateClientData(queryClient),
  });
}

function useStaffQuery() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await api.get<ClientStaffRecord[] | ClientListApiResponse<ClientStaffRecord>>(
        "/staff",
      );

      return getClientList(response.data);
    },
  });
}

function useClientDetailsQuery(clientId: string) {
  return useQuery({
    queryKey: ["client-details", clientId],
    queryFn: async () => {
      const response = await api.get<{ data?: ClientRecord }>(`/clients/${clientId}`);

      return response.data;
    },
    enabled: Boolean(clientId),
  });
}

export function useEditClientPage(): EditClientViewState {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const user = useAuthStore((state) => state.user);
  const clientId = searchParams.get("clientId") ?? "";
  const staffQuery = useStaffQuery();
  const clientDetailsQuery = useClientDetailsQuery(clientId);
  const updateClient = useUpdateClient();
  const staffs = useMemo(() => staffQuery.data ?? [], [staffQuery.data]);
  const client = clientDetailsQuery.data?.data ?? null;

  const defaultValues = useMemo(() => {
    const {
      assignedStaffId: _assignedStaffId,
      assignedStaffName: _assignedStaffName,
      assignedStaffDetails: _assignedStaffDetails,
      profile: _profile,
      ...clientValues
    } = client ?? {};

    void _assignedStaffId;
    void _assignedStaffName;
    void _assignedStaffDetails;
    void _profile;

    return {
      ...clientFormDefaults,
      ...clientValues,
      clientId: client?.clientId ?? clientId,
      dateOfBirth: formatInputDate(client?.profile?.dateOfBirth),
      passportExpiryDate: formatInputDate(client?.profile?.passportExpiryDate),
      gender: client?.profile?.gender,
      email: client?.profile?.email,
      address: client?.profile?.address,
      nationality: client?.profile?.nationality,
      passportNumber: client?.profile?.passportNumber,
      statusOfResidence: client?.profile?.statusOfResidence,
      lastQualification: client?.profile?.lastQualification,
      japaneseLanguageLevel: client?.profile?.japaneseLanguageLevel,
      schoolName: client?.profile?.schoolName,
      course: client?.profile?.course,
      intake: client?.profile?.intake,
      jobCategory: client?.profile?.jobCategory,
      jobTitle: client?.profile?.jobTitle,
      companyName: client?.profile?.companyName,
      workLocation: client?.profile?.workLocation,
      sponsorName: client?.profile?.sponsorName,
      sponsorRelationship: client?.profile?.sponsorRelationship,
      sponsorStatusOfResidence: client?.profile?.sponsorStatusOfResidence,
      visaStatus: client?.profile?.visaStatus,
      cv: client?.profile?.cv,
      assignedStaff:
        typeof client?.assignedStaff === "object" && client.assignedStaff
          ? client.assignedStaff.staffId
          : client?.assignedStaff ?? "",
    };
  }, [client, clientId]);

  const editableClientFields = useMemo(
    () =>
      getClientFormFields(
        staffs.map((staff) => ({
          label: staff.name,
          value: String(staff.staffId),
        })),
        canAssignClient(user),
        false,
      ),
    [staffs, user],
  );

  const handleUpdateClient = async (values: Record<string, string>) => {
    if (!client?._id) {
      setFormError("Client record id is missing.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const remarks = buildRemarksValue({
        existingRemarks: client.remarks,
        remarksDate: values.remarksDate,
        remarksBy: values.remarksBy,
        remarksText: values.remarksText,
      });
      const payload = compactPayload({
        ...values,
        clientId: values.clientId,
        assignedStaff: canAssignClient(user) ? values.assignedStaff || undefined : undefined,
        remarks,
        remarksDate: undefined,
        remarksBy: undefined,
        remarksMedium: undefined,
        remarksText: undefined,
      });

      await updateClient.mutateAsync({ clientId: client.clientId, payload });
      router.push(`/client/clientDetailPage?clientId=${values.clientId}`);
    } catch (error) {
      console.error("Failed to update client", error);
      setFormError(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return {
    clientId,
    client,
    user,
    sidebarCollapsed,
    isLoading: clientDetailsQuery.isLoading || staffQuery.isLoading,
    isError: clientDetailsQuery.isError || staffQuery.isError,
    saving,
    formError,
    defaultValues,
    editableClientFields,
    canEditSelectedClient: client
      ? canEditClient(user, { assignedStaff: client.assignedStaff })
      : false,
    setSidebarCollapsed,
    handleUpdateClient,
    handleCancel: () => router.push(`/client/clientDetailPage?clientId=${clientId}`),
  };
}
