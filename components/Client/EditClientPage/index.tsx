"use client";

import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import ReusableForm from "@/components/ReusableForm";
import Remarks from "@/components/Remarks";
import Sidebar from "@/components/Sidebar";
import { useEditClientPage } from "./hook";


export default function EditClientPage() {
  return (
    <Suspense fallback={<EditClientFallback />}>
      <EditClientPageContent />
    </Suspense>
  );
}

function EditClientPageContent() {
  const {
    clientId,
    client,
    user,
    sidebarCollapsed,
    isLoading,
    isError,
    saving,
    formError,
    defaultValues,
    editableClientFields,
    canEditSelectedClient,
    setSidebarCollapsed,
    handleUpdateClient,
    handleCancel,
  } = useEditClientPage();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        selected="Clients"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8">
        <Navbar title="Edit Client" />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Clients", href: "/client" },
              {
                label: client?.fullName ?? "Edit Client",
                href: `/client/edit?clientId=${clientId}`,
                current: true,
              },
            ]}
          />
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
            Loading client form...
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            Failed to load client form.
          </div>
        ) : !client ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Client not found</h3>
            <p className="mt-2 text-sm text-gray-600">
              The selected client record does not exist.
            </p>
          </div>
        ) : !canEditSelectedClient ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Read only</h3>
            <p className="mt-2 text-sm text-gray-600">
              You can view this client, but only the assigned staff or super admin can edit it.
            </p>
          </div>
        ) : (
          <ReusableForm
            title="Client Information"
            fields={editableClientFields}
            defaultValues={defaultValues}
            submitLabel="Update Client"
            loading={saving}
            error={formError}
            onSubmit={handleUpdateClient}
            onCancel={handleCancel}
          >
            <Remarks
              mode="edit"
              value={client.remarks}
              clientId={client._id}
              staffLocation={user?.location}
              staffName={user?.name}
            />
          </ReusableForm>
        )}
      </main>
    </div>
  );
}

function EditClientFallback() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <aside className="w-64 bg-white p-5 shadow-lg">Loading...</aside>
      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8">
        <div className="h-16 rounded bg-white shadow" />
      </main>
    </div>
  );
}
