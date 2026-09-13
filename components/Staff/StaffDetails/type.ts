export type Staff = {
  _id: string;
  staffId: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: "staff";
  isActive: boolean;
  totalClients: number;
  createdAt: string;
};

export type StaffDetailsResponse = {
  success: boolean;
  data: Staff;
};
