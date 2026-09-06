"use client";

import { useMemo, useState } from "react";
import type { RemarkEntry } from "./type";
import { getTimezoneForLocation } from "@/lib/timezone";

const staticRemarks: RemarkEntry[] = [
  {
    id: "static-1",
    date: "2026-08-28",
    staffName: "Ram Sharma",
    text: "Passport and academic documents verified.",
  },
  {
    id: "static-2",
    date: "2026-08-30",
    staffName: "Hari Thapa",
    text: "Followed up with the client about the remaining bank documents.",
  },
  {
    id: "static-3",
    date: "2026-09-02",
    staffName: "Ram Sharma",
    text: "Client confirmed that the remaining documents will be submitted this week.",
  },
];

export function useRemarks(remarks: RemarkEntry[] = [], staffLocation?: string) {
  const [remarkHistory, setRemarkHistory] = useState<RemarkEntry[]>(
    remarks.length > 0 ? remarks : staticRemarks,
  );
  const timezone = getTimezoneForLocation(staffLocation);
  const defaultRemarkDate = useMemo(() => getDateInputValue(timezone), [timezone]);
  const [selectedRemarkId, setSelectedRemarkId] = useState<string | undefined>(
    () => remarkHistory[0]?.id,
  );

  const selectedRemark = useMemo(
    () => remarkHistory.find((remark) => remark.id === selectedRemarkId),
    [remarkHistory, selectedRemarkId],
  );

  const addRemark = (remark: RemarkEntry) => {
    setRemarkHistory((prev) => [remark, ...prev]);
    setSelectedRemarkId(remark.id);
  };

  return {
    defaultRemarkDate,
    timezone,
    remarkHistory,
    selectedRemarkId,
    setSelectedRemarkId,
    selectedRemark,
    addRemark,
  };
}

function getDateInputValue(timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";

  return `${year}-${month}-${day}`;
}