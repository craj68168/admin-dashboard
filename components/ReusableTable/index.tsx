"use client";

import { useState } from "react";
import Link from "next/link";

export type ClientTableRow = {
  clientId: number;
  fullName: string;
  phone?: string;
  visaType?: string;
  coeStatus?: string;
  visaStatus?: string;
  clientStatus?: string;
  assignedStaffId?: number | string | null;
  assignedStaffName?: string;
};

type ClientTableVariant = "compact" | "staff";

type ClientTableProps = {
  title: string;
  clients: ClientTableRow[];
  variant?: ClientTableVariant;
  staffs?: Array<{ id?: number | string; name: string; _id?: string }>;
  canManageAssignments?: boolean;
  canEditClients?: boolean;
  canUpdateClientStatus?: boolean;
  onAssignClient?: (clientId: number, staffId: number | string) => void;
  onUpdateClientField?: (
    clientId: number,
    field: "coeStatus" | "visaStatus" | "clientStatus",
    value: string,
  ) => void;
};

const coeStatusOptions = [
  "Not Applied",
  "Applied",
  "Processing",
  "Received",
  "Rejected",
];

const visaStatusOptions = [
  "Not Applied",
  "Applied",
  "Processing",
  "Approved",
  "Rejected",
];

const clientStatusOptions = [
  "New",
  "Document Collection",
  "Processing",
  "COE Applied",
  "COE Received",
  "Visa Applied",
  "Visa Approved",
  "Visa Rejected",
  "Departed",
  "Arrived in Japan",
];

export default function ClientTable({
  title,
  clients,
  variant = "compact",
  staffs = [],
  canManageAssignments = false,
  canEditClients = true,
  canUpdateClientStatus = true,
  onAssignClient,
  onUpdateClientField,
}: ClientTableProps) {
  const isStaffVariant = variant === "staff";
  const colSpan = isStaffVariant ? 8 : 3;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className={`w-full text-sm ${isStaffVariant ? "min-w-[1120px]" : "min-w-[680px]"}`}>
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600">
              <th className="p-3 text-left font-semibold">Client ID</th>
              <th className="p-3 text-left font-semibold">Client Name</th>
              {isStaffVariant && (
                <>
                  <th className="p-3 text-left font-semibold">Phone</th>
                  <th className="p-3 text-left font-semibold">Visa Type</th>
                  <th className="p-3 text-left font-semibold">COE Status</th>
                  <th className="p-3 text-left font-semibold">Visa Status</th>
                  <th className="p-3 text-left font-semibold">Client Status</th>
                </>
              )}
              <th className="p-3 text-left font-semibold">
                {isStaffVariant ? "Action" : "Assign To"}
              </th>
            </tr>
          </thead>

          <tbody>
            {clients.length === 0 && (
              <tr>
                <td className="p-6 text-center text-sm text-gray-500" colSpan={colSpan}>
                  No clients found.
                </td>
              </tr>
            )}

            {clients.map((client) => {
              const assignedStaff = staffs.find(
                (staff) =>
                  String(staff.id) === String(client.assignedStaffId ?? "") ||
                  String(staff._id) === String(client.assignedStaffId ?? ""),
              );

              return (
                <tr key={client.clientId} className="border-b last:border-none">
                  <td className="p-3 text-gray-700">#{client.clientId}</td>
                  <td className="p-3">
                    <ClientNameLink client={client} />
                  </td>

                  {isStaffVariant && (
                    <>
                      <td className="p-3 text-gray-600">{client.phone ?? "-"}</td>
                      <td className="p-3 text-gray-600">{client.visaType ?? "-"}</td>
                      <td className="p-3">
                        {canUpdateClientStatus ? (
                          <StatusSelect
                            value={client.coeStatus ?? "Not Applied"}
                            options={coeStatusOptions}
                            onChange={(value) =>
                              onUpdateClientField?.(client.clientId, "coeStatus", value)
                            }
                          />
                        ) : (
                          <StatusBadge value={client.coeStatus ?? "Not Applied"} />
                        )}
                      </td>
                      <td className="p-3">
                        {canUpdateClientStatus ? (
                          <StatusSelect
                            value={client.visaStatus ?? "Not Applied"}
                            options={visaStatusOptions}
                            onChange={(value) =>
                              onUpdateClientField?.(client.clientId, "visaStatus", value)
                            }
                          />
                        ) : (
                          <StatusBadge value={client.visaStatus ?? "Not Applied"} />
                        )}
                      </td>
                      <td className="p-3">
                        {canUpdateClientStatus ? (
                          <StatusSelect
                            value={client.clientStatus ?? "New"}
                            options={clientStatusOptions}
                            onChange={(value) =>
                              onUpdateClientField?.(client.clientId, "clientStatus", value)
                            }
                          />
                        ) : (
                          <StatusBadge value={client.clientStatus ?? "New"} />
                        )}
                      </td>
                    </>
                  )}

                  <td className="p-3">
                    {isStaffVariant ? (
                      <Link
                        href={
                          canEditClients
                            ? `/client/edit?clientId=${client.clientId}`
                            : `/client/clientDetailPage?clientId=${client.clientId}`
                        }
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                      >
                        {canEditClients ? "Edit" : "View"}
                      </Link>
                    ) : canManageAssignments ? (
                      <AssignmentSelect
                        value={String(client.assignedStaffId ?? "")}
                        staffs={staffs}
                        onSave={(staffId) => onAssignClient?.(client.clientId, staffId)}
                      />
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                        {assignedStaff?.name ?? client.assignedStaffName ?? "Unassigned"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientNameLink({ client }: { client: ClientTableRow }) {
  return (
    <Link
      href={`/client/clientDetailPage?clientId=${client.clientId}`}
      className="font-medium text-gray-900 transition-colors hover:text-blue-600"
    >
      {client.fullName}
    </Link>
  );
}

function StatusBadge({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
      {value}
    </span>
  );
}

function AssignmentSelect({
  value,
  staffs,
  onSave,
}: {
  value: string;
  staffs: Array<{ id?: number | string; name: string; _id?: string }>;
  onSave: (staffId: string) => void;
}) {
  const [pending, setPending] = useState(value);
  const hasChanged = pending !== value;

  return (
    <div className="flex items-center gap-2">
      <select
        value={pending}
        onChange={(event) => setPending(event.target.value)}
        className="min-w-44 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-blue-500"
      >
        <option value="">Unassigned</option>
        {staffs.map((staff) => (
          <option key={String(staff.id ?? staff._id)} value={String(staff.id ?? staff._id)}>
            {staff.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={!hasChanged}
        onClick={() => onSave(pending)}
        className="shrink-0 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Save
      </button>
    </div>
  );
}

function StatusSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [pending, setPending] = useState(value);
  const hasChanged = pending !== value;

  return (
    <div className="flex items-center gap-2">
      <select
        value={pending}
        onChange={(event) => setPending(event.target.value)}
        className="min-w-36 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={!hasChanged}
        onClick={() => onChange(pending)}
        className="shrink-0 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Save
      </button>
    </div>
  );
}
