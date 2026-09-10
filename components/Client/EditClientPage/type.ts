import type { ClientRecord } from "../client-query";

export type {
  ClientApiResponse,
  ClientListApiResponse,
  ClientRecord,
  ClientStaffRecord,
} from "../client-query";

export type EditClientViewState = {
  clientId: number | string;
  client: ClientRecord | null;
  user: ReturnType<typeof import("@/store/auth-store").useAuthStore.getState>["user"];
  sidebarCollapsed: boolean;
  isLoading: boolean;
  isError: boolean;
  saving: boolean;
  formError: string;
  defaultValues: Record<string, string | number | undefined>;
  editableClientFields: ReturnType<
    typeof import("@/components/ReusableForm/form-configs").getClientFormFields
  >;
  canEditSelectedClient: boolean;
  setSidebarCollapsed: (value: boolean | ((previous: boolean) => boolean)) => void;
  handleUpdateClient: (values: Record<string, string>) => Promise<void>;
  handleCancel: () => void;
};
