"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientFormDefaults, getClientFormFields } from "@/components/ReusableForm/form-configs";
import { getApiErrorMessage } from "@/lib/api-message";
import { api } from "@/lib/axios";
import { canAssignClient, canEditClient } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";
import type {
  ClientApiResponse,
  ClientListApiResponse,
  ClientRecord,
  ClientStaffRecord,
  EditClientViewState,
} from "./type";

function getClientList<T>(response: ClientListApiResponse<T> | T[] | undefined): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.data ?? [];
}

function mapClientStaff(staff: ClientStaffRecord): ClientStaffRecord {
  return {
    ...staff,
    id: staff.staffId ?? staff._id ?? 0,
  };
}

function mapClient(client: ClientApiResponse): ClientRecord {
  const assignedStaff = client.assignedStaff;
  const assignedStaffId =
    typeof assignedStaff === "object" && assignedStaff
      ? assignedStaff._id ?? assignedStaff.staffId ?? null
      : assignedStaff ?? null;

  return {
    ...client,
    clientId: Number(client.clientId ?? 0),
    fullName: client.fullName ?? "Unknown Client",
    assignedStaffId,
    assignedStaffName:
      typeof assignedStaff === "object" && assignedStaff
        ? assignedStaff.name ?? "Unassigned"
        : "Unassigned",
  };
}

function compactPayload(payload: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value !== undefined),
  );
}

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

function invalidateClientData(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ["client-page-data"] });
  void queryClient.invalidateQueries({ queryKey: ["staff-clients"] });
  void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
  void queryClient.invalidateQueries({ queryKey: ["staff"] });
}

function useEditClientData() {
  return useQuery({
    queryKey: ["client-page-data"],
    queryFn: async () => {
      const [staffResponse, clientResponse] = await Promise.all([
        api.get<ClientStaffRecord[] | ClientListApiResponse<ClientStaffRecord>>(
          "/staff/staff",
        ),
        api.get<ClientApiResponse[] | ClientListApiResponse<ClientApiResponse>>(
          "/clients/clients",
        ),
      ]);

      return {
        staffs: getClientList(staffResponse.data).map(mapClientStaff),
        clients: getClientList(clientResponse.data).map(mapClient),
      };
    },
  });
}

function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recordId,
      payload,
    }: {
      recordId: string;
      payload: Record<string, string | number | undefined>;
    }) => api.put(`/clients/clients/${recordId}`, payload),
    onSuccess: () => invalidateClientData(queryClient),
  });
}

export function useEditClientPage(): EditClientViewState {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const user = useAuthStore((state) => state.user);
  const clientId = Number(searchParams.get("clientId") ?? 0);
  const { data, isLoading, isError } = useEditClientData();
  const updateClient = useUpdateClient();
  const staffs = useMemo(() => data?.staffs ?? [], [data?.staffs]);
  const client = useMemo(
    () => data?.clients.find((item) => Number(item.clientId) === clientId) ?? null,
    [clientId, data?.clients],
  );

  const defaultValues = useMemo(() => {
    const {
      assignedStaffId: _assignedStaffId,
      assignedStaffName: _assignedStaffName,
      ...clientValues
    } = client ?? {};

    void _assignedStaffId;
    void _assignedStaffName;

    return {
      ...clientFormDefaults,
      ...clientValues,
      clientId: Number(client?.clientId ?? clientId),
      dateOfBirth: formatInputDate(client?.dateOfBirth),
      passportExpiryDate: formatInputDate(client?.passportExpiryDate),
      assignedStaff:
        typeof client?.assignedStaff === "object" && client.assignedStaff
          ? client.assignedStaff._id
          : client?.assignedStaff ?? "",
    };
  }, [client, clientId]);

  const editableClientFields = useMemo(
    () =>
      getClientFormFields(
        staffs.map((staff) => ({
          label: staff.name,
          value: String(staff._id ?? staff.id),
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
        clientId: Number(values.clientId),
        assignedStaff: canAssignClient(user) ? values.assignedStaff || undefined : undefined,
        remarks,
        remarksDate: undefined,
        remarksBy: undefined,
        remarksMedium: undefined,
        remarksText: undefined,
      });

      await updateClient.mutateAsync({ recordId: client._id, payload });
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
    isLoading,
    isError,
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
