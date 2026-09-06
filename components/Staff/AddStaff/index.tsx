"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import ReusableForm from "@/components/ReusableForm";
import { staffFormFields } from "@/components/ReusableForm/form-configs";
import Sidebar from "@/components/Sidebar";
import { useCreateStaff } from "@/components/Staff/hook";
import { useAuthStore } from "@/store/auth-store";
import { canAddStaff } from "@/lib/permissions";

export default function AddStaff() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formError, setFormError] = useState("");
  const user = useAuthStore((state) => state.user);
  const createStaff = useCreateStaff();

  const handleCreateStaff = async (values: Record<string, string>) => {
    setFormError("");

    try {
      await createStaff.mutateAsync({
        name: values.name,
        phone: values.phone,
        location: values.location,
        email: values.email,
        password: values.password,
      });

      router.push("/staff");
    } catch (error) {
      console.error("Failed to create staff", error);
      setFormError("Failed to create staff.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        selected="Staff"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8">
        <Navbar title="Add Staff" />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Staff", href: "/staff" },
              { label: "Add Staff", current: true },
            ]}
          />
        </div>

        {!canAddStaff(user) ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Access denied</h3>
            <p className="mt-2 text-sm text-gray-600">
              Only super admin can add staff.
            </p>
          </div>
        ) : (
          <ReusableForm
            title="Staff Information"
            fields={staffFormFields}
            submitLabel="Save Staff"
            loading={createStaff.isPending}
            error={formError}
            onSubmit={handleCreateStaff}
            onCancel={() => router.push("/staff")}
          />
        )}
      </main>
    </div>
  );
}
