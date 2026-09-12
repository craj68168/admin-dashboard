"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { canEditClient } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";

type Payment = {
  _id: string;
  milestone: string;
  totalCharge: number;
  amountPaid: number;
  balance?: number;
  status?: "Paid" | "Partial" | "Unpaid";
  paymentDate?: string;
  paymentMethod?: string;
};

export default function ClientPayments({
  clientId,
  assignedStaff,
}: {
  clientId: string;
  assignedStaff?: string | null;
}) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const canRecord = canEditClient(user, { assignedStaff });
  const [milestone, setMilestone] = useState("Registration Fee");
  const [totalCharge, setTotalCharge] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [error, setError] = useState("");

  const paymentsQuery = useQuery({
    queryKey: ["payments", clientId],
    queryFn: async () => {
      const response = await api.get<{ data?: Payment[] }>(
        `/payments?clientId=${encodeURIComponent(clientId)}`,
      );
      return response.data.data ?? [];
    },
  });

  const createPayment = useMutation({
    mutationFn: () =>
      api.post("/payments", {
        clientId,
        milestone,
        totalCharge: Number(totalCharge),
        amountPaid: Number(amountPaid),
        paymentMethod,
      }),
    onSuccess: async () => {
      setTotalCharge("");
      setAmountPaid("");
      setError("");
      await queryClient.invalidateQueries({ queryKey: ["payments", clientId] });
      await queryClient.invalidateQueries({ queryKey: ["revenue"] });
      await queryClient.invalidateQueries({ queryKey: ["performance"] });
    },
    onError: () => setError("Unable to save this payment."),
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !totalCharge ||
      !amountPaid ||
      Number(amountPaid) > Number(totalCharge)
    ) {
      setError("Enter valid charge and paid amounts.");
      return;
    }
    createPayment.mutate();
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h4 className="mb-4 text-lg font-semibold text-gray-900">Payments</h4>
      <div className="space-y-3">
        {paymentsQuery.data?.map((payment) => (
          <div
            key={payment._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 p-3 text-sm"
          >
            <div>
              <p className="font-semibold text-gray-900">{payment.milestone}</p>
              <p className="text-gray-500">
                {payment.paymentMethod ?? "Other"} ·{" "}
                {payment.paymentDate
                  ? new Date(payment.paymentDate).toLocaleDateString()
                  : "No date"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                NPR {payment.amountPaid.toLocaleString()} /{" "}
                {payment.totalCharge.toLocaleString()}
              </p>
              <p className="text-gray-500">{payment.status ?? "Unpaid"}</p>
            </div>
          </div>
        ))}
        {!paymentsQuery.isLoading && paymentsQuery.data?.length === 0 && (
          <p className="text-sm text-gray-500">No payment records yet.</p>
        )}
      </div>

      {canRecord && (
        <form
          onSubmit={submit}
          className="mt-5 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2"
        >
          <input
            value={milestone}
            onChange={(event) => setMilestone(event.target.value)}
            placeholder="Milestone"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>Card</option>
            <option>Online</option>
            <option>Other</option>
          </select>
          <input
            type="number"
            min="0"
            value={totalCharge}
            onChange={(event) => setTotalCharge(event.target.value)}
            placeholder="Total charge"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            value={amountPaid}
            onChange={(event) => setAmountPaid(event.target.value)}
            placeholder="Amount paid"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={createPayment.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {createPayment.isPending ? "Saving..." : "Record payment"}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        </form>
      )}
    </section>
  );
}
