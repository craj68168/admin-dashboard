"use client";

import { useState } from "react";
import type { RemarkEntry } from "./type";

type SaveRemarkInput = {
  clientId: string | number;
  date: string;
  medium: string;
  text: string;
};

export function useSaveRemark() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const saveRemark = async (input: SaveRemarkInput): Promise<RemarkEntry | null> => {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/clients/${input.clientId}/remarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: input.date,
          medium: input.medium,
          text: input.text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save remark");
      }

      return (await response.json()) as RemarkEntry;
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