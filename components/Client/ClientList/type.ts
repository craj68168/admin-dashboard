import type { ClientPageData, ClientRecord, ClientStaffRecord } from "../client-query";

export type {
  ClientApiResponse,
  ClientListApiResponse,
  ClientRecord,
  ClientStaffRecord,
} from "../client-query";

export type ClientListData = ClientPageData;

export type ClientListViewState = {
  sidebarCollapsed: boolean;
  staffs: ClientStaffRecord[];
  clients: ClientRecord[];
  isLoading: boolean;
  isError: boolean;
  canCreateClient: boolean;
  canAssignClient: boolean;
  setSidebarCollapsed: (value: boolean | ((previous: boolean) => boolean)) => void;
  handleCreateClient: () => void;
  handleAssignClient: (clientId: number | string, staffId: number | string) => void;
};
