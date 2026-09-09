import type { ClientRecord, ClientStaffRecord } from "../client-query";

export type {
  ClientApiResponse,
  ClientListApiResponse,
  ClientRecord,
  ClientStaffRecord,
} from "../client-query";

export type DetailField = {
  label: string;
  value?: string | number;
};

export type ClientDetailViewState = {
  mode: string | null;
  clientId: number;
  client: ClientRecord | null;
  staffs: ClientStaffRecord[];
  assignedStaff: ClientStaffRecord | null;
  sidebarCollapsed: boolean;
  defaultClientId: number;
  isLoading: boolean;
  isError: boolean;
  isCreating: boolean;
  formError: string;
  canAssignClient: boolean;
  setSidebarCollapsed: (value: boolean | ((previous: boolean) => boolean)) => void;
  handleCreateClient: (values: Record<string, string>) => Promise<void>;
  handleCancel: () => void;
};
