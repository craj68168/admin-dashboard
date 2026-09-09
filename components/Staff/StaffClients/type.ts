import type { ClientRecord, ClientStaffRecord } from "@/components/Client/client-query";

export type {
  ClientApiResponse,
  ClientListApiResponse,
  ClientRecord,
  ClientStaffRecord,
} from "@/components/Client/client-query";

export type ClientStatusField = "coeStatus" | "visaStatus" | "clientStatus";

export type StaffClientStatusField = ClientStatusField;

export type UpdateClientFieldHandler = (
  clientId: number,
  field: StaffClientStatusField,
  value: string,
) => void;

export type StaffClientOption = ClientStaffRecord & {
  id: number | string;
};

export type StaffClientsViewState = {
  staffId: string;
  sidebarCollapsed: boolean;
  staffs: StaffClientOption[];
  clients: ClientRecord[];
  selectedStaff: StaffClientOption | null;
  isLoading: boolean;
  isError: boolean;
  setSidebarCollapsed: (value: boolean | ((previous: boolean) => boolean)) => void;
  handleUpdateClientField: UpdateClientFieldHandler;
};
