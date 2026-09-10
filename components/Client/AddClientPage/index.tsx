"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import ReusableForm from "@/components/ReusableForm";
import {
  clientFormDefaults,
  getClientFormFields,
} from "@/components/ReusableForm/form-configs";
import Sidebar from "@/components/Sidebar";
import { useAddClientPage } from "./hook";

export default function AddClientPage() {
  const {
    staffs,
    sidebarCollapsed,
    setSidebarCollapsed,
    defaultClientId,
    isLoading,
    isError,
    isCreating,
    formError,
    canAssignClient,
    handleCreateClient,
    handleCancel,
  } = useAddClientPage();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        selected="Clients"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8">
        <Navbar title="Add Client" />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Clients", href: "/client" },
              { label: "Add Client", current: true },
            ]}
          />
        </div>

        {isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            Failed to load staff list.
          </div>
        ) : (
          <ReusableForm
            title="Client Information"
            fields={getClientFormFields(
              staffs.map((staff) => ({
                label: staff.name,
                value: String(staff.staffId),
              })),
              canAssignClient,
            )}
            defaultValues={{
              ...clientFormDefaults,
              clientId: defaultClientId,
            }}
            submitLabel="Save Client"
            loading={isCreating || isLoading}
            error={formError}
            onSubmit={handleCreateClient}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
}
