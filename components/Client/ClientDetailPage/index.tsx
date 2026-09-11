"use client";

import { Suspense, type ReactNode } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Remarks from "@/components/Remarks";
import Sidebar from "@/components/Sidebar";
import { useClientDetailPage } from "./hook";
import type { DetailField } from "./type";

export default function ClientDetailPage() {
  return (
    <Suspense fallback={<ClientDetailFallback />}>
      <ClientDetailPageContent />
    </Suspense>
  );
}

function ClientDetailPageContent() {
  const {
    client,
    assignedStaff,
    sidebarCollapsed,
    isLoading,
    isError,
    setSidebarCollapsed,
  } = useClientDetailPage();

  if (isLoading) {
    return (
      <PageShell
        title="Client Details"
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
          Loading client details...
        </div>
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell
        title="Client Details"
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      >
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          Failed to load client details.
        </div>
      </PageShell>
    );
  }

  if (!client) {
    return (
      <PageShell
        title="Client Details"
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      >
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Clients", href: "/client" },
            { label: "Client not found", current: true },
          ]}
        />

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">
            Client not found
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            The selected client record does not exist.
          </p>
        </div>
      </PageShell>
    );
  }

  const profile = client.profile;

  return (
    <PageShell
      title={client.fullName}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
    >
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Clients", href: "/client" },
          ...(assignedStaff?.staffId
            ? [
                {
                  label: assignedStaff.name,
                  href: `/staff/${assignedStaff.staffId}/clients`,
                },
              ]
            : []),
          { label: client.fullName, current: true },
        ]}
      />

      <div className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Client #{client.clientId}
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-gray-900">
                {client.fullName}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Assigned to {assignedStaff?.name ?? "Unassigned"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DetailValue label="Visa Type" value={client.visaType} />
              <DetailValue label="COE Status" value={client.coeStatus} />
              <DetailValue label="Visa Status" value={profile?.visaStatus} />
              <DetailValue label="Client Status" value={client.clientStatus} />
            </div>
          </div>
        </section>

        <DetailSection
          title="Client Details"
          fields={[
            { label: "Client ID", value: client.clientId },
            { label: "Full Name", value: client.fullName },
            { label: "Phone", value: client.phone },
            { label: "Email", value: profile?.email },
            { label: "Date of Birth", value: formatDate(profile?.dateOfBirth) },
            { label: "Gender", value: profile?.gender },
            { label: "Address", value: profile?.address },
            { label: "Nationality", value: profile?.nationality ?? "Nepali" },
            { label: "Visa Type", value: client.visaType },
            { label: "COE Status", value: client.coeStatus },
            { label: "Visa Status", value: profile?.visaStatus },
            { label: "Client Status", value: client.clientStatus },
            { label: "Passport Number", value: profile?.passportNumber },
            {
              label: "Passport Expiry Date",
              value: formatDate(profile?.passportExpiryDate),
            },
            { label: "Status of Residence", value: profile?.statusOfResidence },
            { label: "Last Qualification", value: profile?.lastQualification },
            {
              label: "Japanese Language Level",
              value: profile?.japaneseLanguageLevel,
            },
            { label: "School Name", value: profile?.schoolName },
            { label: "Course", value: profile?.course },
            { label: "Intake", value: profile?.intake },
            { label: "Job Category", value: profile?.jobCategory },
            { label: "Job Title", value: profile?.jobTitle },
            { label: "Company Name", value: profile?.companyName },
            { label: "Work Location", value: profile?.workLocation },
            { label: "Sponsor Name", value: profile?.sponsorName },
            { label: "Sponsor Relationship", value: profile?.sponsorRelationship },
            {
              label: "Sponsor Status of Residence",
              value: profile?.sponsorStatusOfResidence,
            },
            { label: "CV", value: profile?.cv },
          ]}
        />

        <Remarks value={profile?.remark ?? client.remarks} />
      </div>
    </PageShell>
  );
}

function ClientDetailFallback() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <aside className="w-64 bg-white p-5 shadow-lg">Loading...</aside>
      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8">
        <div className="h-16 rounded bg-white shadow" />
      </main>
    </div>
  );
}

function PageShell({
  children,
}: {
  title: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8">
        {children}
      </main>
    </div>
  );
}

function DetailSection({
  title,
  fields,
  children,
}: {
  title: string;
  fields: DetailField[];
  children?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h4 className="mb-5 text-lg font-semibold text-gray-900">{title}</h4>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <DetailValue
            key={field.label}
            label={field.label}
            value={field.value}
          />
        ))}
        {children}
      </div>
    </section>
  );
}

function DetailValue({ label, value }: DetailField) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value || "-"}</p>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) {
    return undefined;
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
