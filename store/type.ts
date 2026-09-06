export type UserRole = "superadmin" | "staff";

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  staffId?: number | string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;

  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}
