import type { ClientRecord, ClientStaffRecord } from "../client-query";

export type {
  ClientApiResponse,
  ClientListApiResponse,
  ClientRecord,
  ClientProfileRecord,
  ClientStaffRecord,
} from "../client-query";

export type DetailField = {
  label: string;
  value?: string | number | null;
};

export type ClientDetailViewState = {
  clientId: number | string;
  client: ClientRecord | null;
  assignedStaff: ClientStaffRecord | null;
  sidebarCollapsed: boolean;
  isLoading: boolean;
  isError: boolean;
  setSidebarCollapsed: (value: boolean | ((previous: boolean) => boolean)) => void;
  handleCancel: () => void;
};
