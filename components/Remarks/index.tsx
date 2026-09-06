"use client";

import { useState } from "react";
import { useRemarks } from "./hook";
import { useSaveRemark } from "./useSaveRemark";
import type { RemarkEntry, RemarksProps } from "./type";

const remarkMediumOptions = ["WhatsApp", "Meeting", "Company Visit", "Other"];

export default function Remarks({
  mode = "view",
  value,
  remarks = [],
  staffName,
  staffLocation,
  clientId,
}: RemarksProps) {
  const {
    defaultRemarkDate,
    timezone,
    remarkHistory,
    selectedRemarkId,
    setSelectedRemarkId,
    selectedRemark,
    addRemark,
  } = useRemarks(remarks, staffLocation);

  const { saveRemark, isSaving, error } = useSaveRemark();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [medium, setMedium] = useState("");
  const [text, setText] = useState("");

  const date = selectedDate ?? defaultRemarkDate;

  const canSave = Boolean(clientId) && Boolean(date) && Boolean(medium) && Boolean(text.trim());

  const handleSave = async () => {
    if (!clientId) return;

    const saved = await saveRemark({
      clientId,
      staffName: staffName ?? "Current Staff",
      medium: medium as NonNullable<RemarkEntry["medium"]>,
      text,
    });

    if (saved) {
      addRemark({
        id: saved.id,
        date: saved.date,
        staffName: saved.staffName ?? staffName ?? "Current Staff",
        text: saved.text,
        medium: saved.medium,
      });

      setSelectedDate(null);
      setMedium("");
      setText("");
    }
  };

  if (mode === "edit") {
    return (
      <section className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
        <h4 className="text-lg font-semibold text-gray-900">Remarks</h4>

        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          {/* Left: remark history list */}
          <div className="flex flex-col rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <p className="text-xs font-semibold uppercase text-gray-500">
                Remark History
              </p>
            </div>

            <ul className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
              {remarkHistory.length === 0 && (
                <li className="p-4 text-sm text-gray-500">No remarks yet.</li>
              )}

              {remarkHistory.map((remark) => (
                <li key={remark.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedRemarkId(remark.id)}
                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      selectedRemarkId === remark.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">{remark.date}</p>
                    <p className="text-xs text-gray-500">
                      {remark.staffName}
                      {remark.medium ? ` · ${remark.medium}` : ""}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                      {remark.text}
                    </p>
                  </button>
                </li>
              ))}
            </ul>

            {selectedRemark && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  {selectedRemark.date} · {selectedRemark.staffName}
                  {selectedRemark.medium ? ` · ${selectedRemark.medium}` : ""}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {selectedRemark.text}
                </p>
              </div>
            )}
          </div>

          {/* Right: new remark form */}
          <div>
            {error && (
              <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Date ({timezone})
                </span>
                <input
                  name="remarksDate"
                  type="date"
                  value={date}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-blue-500"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Staff
                </span>
                <input
                  name="remarksBy"
                  type="text"
                  value={staffName ?? "Current Staff"}
                  readOnly
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700 outline-none"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Medium
                </span>
                <select
                  name="remarksMedium"
                  value={medium}
                  onChange={(event) => setMedium(event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select medium
                  </option>
                  {remarkMediumOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase text-gray-500">
                New Remark
              </span>
              <textarea
                name="remarksText"
                rows={8}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Add progress notes, document notes, or follow-up details."
                className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-blue-500"
              />
            </label>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave || isSaving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h4 className="mb-3 text-lg font-semibold text-gray-900">Remarks</h4>
      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
        {value || "-"}
      </p>
    </section>
  );
}