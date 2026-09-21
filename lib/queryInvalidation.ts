import type { QueryClient } from "@tanstack/react-query";

// =================================================
// INVALIDATE STAFF TARGET DEPENDENCIES
//
// Call this whenever a monthly staff target is:
// - created
// - updated
// - deleted
//
// StaffTarget affects:
// - Staff Details
// - Performance History
// - Admin Dashboard
// - Staff Dashboard
// =================================================

export const invalidateStaffTargetQueries = async (
  queryClient: QueryClient,
  staffId: string,
) => {
  await Promise.all([
    // =================================================
    // STAFF DETAILS
    //
    // Current query:
    // ["staff", staffId]
    // =================================================

    queryClient.invalidateQueries({
      queryKey: ["staff", staffId],
    }),

    // =================================================
    // STAFF TARGET
    //
    // Works even if actual key is:
    // ["staffTarget", staffId, month]
    //
    // Prefix invalidation catches all months.
    // =================================================

    queryClient.invalidateQueries({
      queryKey: ["staffTarget", staffId],
    }),

    // =================================================
    // PERFORMANCE HISTORY
    //
    // Works for:
    // ["staffPerformance", staffId]
    // ["staffPerformance", staffId, month]
    // ["staffPerformance", staffId, filters]
    // =================================================

    queryClient.invalidateQueries({
      queryKey: ["staffPerformanceHistory", staffId],
    }),

    // =================================================
    // ADMIN DASHBOARD
    //
    // Your current Admin Dashboard query key includes:
    //
    // [
    //   "adminDashboard",
    //   selectedMonth,
    //   filters,
    //   rankingPage,
    //   rankingLimit,
    //   paymentPage,
    //   paymentLimit
    // ]
    //
    // Invalidating the root key catches ALL of them.
    // =================================================

    queryClient.invalidateQueries({
      queryKey: ["adminDashboard"],
    }),

    // =================================================
    // STAFF DASHBOARD
    //
    // Current/possible keys:
    //
    // ["staffDashboard", selectedMonth]
    //
    // or after our filter/pagination work:
    //
    // [
    //   "staffDashboard",
    //   selectedMonth,
    //   filters,
    //   clientPage,
    //   clientLimit,
    //   paymentPage,
    //   paymentLimit
    // ]
    //
    // Root invalidation catches all.
    // =================================================

    queryClient.invalidateQueries({
      queryKey: ["staffDashboard"],
    }),

    // =================================================
    // STAFF LIST
    //
    // Useful if target/performance information is
    // displayed in the main staff list later.
    // =================================================

    queryClient.invalidateQueries({
      queryKey: ["staffList"],
    }),
  ]);
};
