"use client";

import { useState, useCallback, useMemo } from "react";

export function usePendingTableValue(value: string, onSave: (value: string) => void) {
  const [pending, setPending] = useState(value);
  const hasChanged = pending !== value;

  const save = () => onSave(pending);

  return {
    pending,
    hasChanged,
    setPending,
    save,
  };
}

export function usePendingRowStatuses(initial: {
  coeStatus: string;
  visaStatus: string;
  clientStatus: string;
}) {
  const [pending, setPending] = useState(initial);

  const setField = useCallback(
    (field: keyof typeof initial, value: string) => {
      setPending((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const changedFields = useMemo(
    () =>
      (Object.keys(pending) as (keyof typeof initial)[]).filter(
        (key) => pending[key] !== initial[key]
      ),
    [pending, initial]
  );

  const hasChanged = changedFields.length > 0;

  return { pending, setField, hasChanged, changedFields };
}