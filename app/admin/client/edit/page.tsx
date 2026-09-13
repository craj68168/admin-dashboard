import { Suspense } from "react";

import EditClient from "@/components/Client/EditClient";

export default function EditClientPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          Loading client...
        </div>
      }
    >
      <EditClient />
    </Suspense>
  );
}
