"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiStaff, CreateStaffPayload, StaffRowItem } from "./staff.type";

type StaffListResponse = {
	data?: ApiStaff[];
};

function mapStaff(staff: ApiStaff): StaffRowItem {
	return {
		id: staff.staffId ?? staff._id ?? "N/A",
		recordId: staff._id,
		name: staff.name ?? "Unknown Staff",
		phone: staff.phone ?? "N/A",
		location: staff.location ?? "N/A",
		email: staff.email ?? "N/A",
		clientsCount: Number(staff.totalClients ?? 0),
		role: staff.role ?? "staff",
		isActive: staff.isActive ?? true,
		createdAt: staff.createdAt,
	};
}

export function useStaffList() {
	return useQuery({
		queryKey: ["staff"],
		queryFn: async () => {
			const response = await api.get<StaffListResponse>("/staff");
			return (response.data.data ?? []).map(mapStaff);
		},
	});
}

export function useCreateStaff() {
	return useMutation({
		mutationFn: (payload: CreateStaffPayload) => api.post("/staff", payload),
	});
}
