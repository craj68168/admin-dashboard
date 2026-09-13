export type UserRole = "superadmin" | "staff";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "staff";
  staffId?: string;
  location?: string;
};

export interface AuthState {
  user: AuthUser | null;
  token: string | null;

  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}
