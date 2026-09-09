"use client";

import { useRouter } from "next/navigation";
import ReusableTable from "@/components/ReusableTable";
import { useStaffList } from "./hook";
import type { StaffRowItem } from "./staff.type";

export default function StaffTable() {
  const router = useRouter();
  const { data: staffs = [], isLoading: loading } = useStaffList();

  const goToClients = (staff: StaffRowItem) =>
    router.push(`/staff/${staff.recordId ?? staff.id}/clients`);

  return (
    <>
      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          Loading staff...
        </div>
      ) : (
        <ReusableTable
          title="Staff List"
          variant="staff-list"
          staffRows={staffs}
          onViewStaffClients={goToClients}
        />
      )}
    </>
  );
}
