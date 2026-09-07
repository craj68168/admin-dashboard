"use client";

import { useState } from "react";
import { api } from "@/lib/axios";
import type { RemarkEntry } from "./type";

type SaveRemarkInput = {
  clientId: string | number;
  staffName: string;
  medium: RemarkEntry["medium"];
  text: string;
};

type ApiRemark = {
  _id: string;
  staffName: string;
  remarks: string;
  medium: NonNullable<RemarkEntry["medium"]>;
  createdAt: string;
};

export function useSaveRemark() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const saveRemark = async (input: SaveRemarkInput): Promise<RemarkEntry | null> => {
    setIsSaving(true);
    setError("");

    try {
      const response = await api.post<{ data: ApiRemark }>("/remarks", {
        clientId: input.clientId,
        staffName: input.staffName,
        remarks: input.text,
        medium: input.medium,
      });

      const saved = response.data.data;
      return {
        id: saved._id,
        date: saved.createdAt,
        staffName: saved.staffName,
        text: saved.remarks,
        medium: saved.medium,
      };
    } catch (err) {
      console.error("Failed to save remark", err);
      setError("Failed to save remark.");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveRemark, isSaving, error };
}