"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import axios from "axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

import { editClientSchema } from "./validation";

import type {
  ClientDetailsResponse,
  EditClientFormValues,
  StaffListResponse,
} from "./type";

// =================================================
// DATE → YYYY-MM-DD
// =================================================

const toDateInputValue = (value?: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
};

// =================================================
// APPEND OPTIONAL VALUE
// =================================================

const appendValue = (formData: FormData, key: string, value: string) => {
  const cleaned = value.trim();

  if (cleaned !== "") {
    formData.append(key, cleaned);
  }
};

export const useEditClientHook = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const clientId = searchParams.get("clientId") ?? "";

  const user = useAuthStore((state) => state.user);

  const role = user?.role;

  const [serverError, setServerError] = useState("");

  // =================================================
  // FORM
  // =================================================

  const {
    control,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<EditClientFormValues>({
    resolver: zodResolver(editClientSchema),

    defaultValues: {
      fullName: "",
      phone: "",
      visaType: "",

      assignedStaff: "",

      coeStatus: "Not Applied",

      clientStatus: "New",

      dateOfBirth: "",
      gender: "",
      email: "",
      address: "",
      nationality: "",

      passportNumber: "",
      passportExpiryDate: "",
      statusOfResidence: "",

      lastQualification: "",

      japaneseLanguageLevel: "",

      schoolName: "",
      course: "",
      intake: "",

      jobCategory: "",
      jobTitle: "",
      companyName: "",
      workLocation: "",

      sponsorName: "",

      sponsorRelationship: "",

      sponsorStatusOfResidence: "",

      visaStatus: "",

      clientImage: null,
      cv: null,
    },
  });

  // =================================================
  // GET CLIENT
  // =================================================

  const {
    data: clientResponse,

    isLoading: isClientLoading,

    isError: isClientError,

    error: clientError,
  } = useQuery({
    queryKey: ["client", clientId],

    queryFn: async () => {
      const response = await api.get<ClientDetailsResponse>(
        `/clients/${clientId}`,
      );

      return response.data;
    },

    enabled: Boolean(clientId),
  });

  const client = clientResponse?.data;

  // =================================================
  // PREFILL FORM
  // =================================================

  useEffect(() => {
    if (!client) {
      return;
    }

    const profile = client.profile;

    reset({
      // =================================================
      // CLIENT
      // =================================================

      fullName: client.fullName ?? "",

      phone: client.phone ?? "",

      visaType: client.visaType ?? "",

      assignedStaff: client.assignedStaff ?? "",

      coeStatus: client.coeStatus ?? "Not Applied",

      clientStatus: client.clientStatus ?? "New",

      // =================================================
      // PERSONAL
      // =================================================

      dateOfBirth: toDateInputValue(profile?.dateOfBirth),

      gender: profile?.gender ?? "",

      email: profile?.email ?? "",

      address: profile?.address ?? "",

      nationality: profile?.nationality ?? "",

      // =================================================
      // PASSPORT
      // =================================================

      passportNumber: profile?.passportNumber ?? "",

      passportExpiryDate: toDateInputValue(profile?.passportExpiryDate),

      statusOfResidence: profile?.statusOfResidence ?? "",

      // =================================================
      // EDUCATION
      // =================================================

      lastQualification: profile?.lastQualification ?? "",

      japaneseLanguageLevel: profile?.japaneseLanguageLevel ?? "",

      schoolName: profile?.schoolName ?? "",

      course: profile?.course ?? "",

      intake: profile?.intake ?? "",

      // =================================================
      // EMPLOYMENT
      // =================================================

      jobCategory: profile?.jobCategory ?? "",

      jobTitle: profile?.jobTitle ?? "",

      companyName: profile?.companyName ?? "",

      workLocation: profile?.workLocation ?? "",

      // =================================================
      // SPONSOR
      // =================================================

      sponsorName: profile?.sponsorName ?? "",

      sponsorRelationship: profile?.sponsorRelationship ?? "",

      sponsorStatusOfResidence: profile?.sponsorStatusOfResidence ?? "",

      // =================================================
      // VISA
      // =================================================

      visaStatus: profile?.visaStatus ?? "",

      // Do not put existing string paths
      // inside File fields.
      clientImage: null,

      cv: null,
    });
  }, [client, reset]);

  // =================================================
  // ADMIN STAFF LIST
  // =================================================

  const { data: staffResponse, isLoading: isStaffLoading } = useQuery({
    queryKey: ["staffList"],

    queryFn: async () => {
      const response = await api.get<StaffListResponse>("/staff");

      return response.data;
    },

    enabled: role === "superadmin",
  });

  // =================================================
  // STAFF OPTIONS
  //
  // Active Staff +
  // currently assigned Staff even if inactive.
  //
  // This prevents an old/inactive assignment
  // from disappearing from the Edit form.
  // =================================================

  const staffOptions = useMemo(() => {
    const staffList = staffResponse?.data ?? [];

    return staffList.filter(
      (staff) => staff.isActive || staff.staffId === client?.assignedStaff,
    );
  }, [staffResponse, client?.assignedStaff]);

  // =================================================
  // UPDATE CLIENT
  // =================================================

  const {
    mutateAsync: updateClient,

    isPending: isUpdating,
  } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.patch(`/clients/${clientId}`, formData);

      return response.data;
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["client", clientId],
      });

      void queryClient.invalidateQueries({
        queryKey: ["staffList"],
      });

      // Refresh any Staff Client list
      // because Admin may have reassigned client.
      void queryClient.invalidateQueries({
        queryKey: ["staff-clients"],
      });
    },
  });

  // =================================================
  // SUBMIT
  // =================================================

  const onSubmit = async (values: EditClientFormValues) => {
    try {
      setServerError("");

      if (!clientId) {
        setServerError("Client ID is missing.");

        return;
      }

      const formData = new FormData();

      // =================================================
      // REQUIRED CLIENT FIELDS
      // =================================================

      formData.append("fullName", values.fullName.trim());

      formData.append("phone", values.phone.trim());

      formData.append("visaType", values.visaType);

      // =================================================
      // STATUS
      // =================================================

      formData.append("coeStatus", values.coeStatus);

      formData.append("clientStatus", values.clientStatus);

      // =================================================
      // ADMIN ASSIGNMENT
      //
      // Only send it when it actually changed.
      //
      // Staff NEVER sends assignedStaff.
      // =================================================

      if (
        role === "superadmin" &&
        values.assignedStaff !== client?.assignedStaff
      ) {
        formData.append("assignedStaff", values.assignedStaff);
      }

      // =================================================
      // PERSONAL
      // =================================================

      appendValue(formData, "dateOfBirth", values.dateOfBirth);

      appendValue(formData, "gender", values.gender);

      appendValue(formData, "email", values.email);

      appendValue(formData, "address", values.address);

      appendValue(formData, "nationality", values.nationality);

      // =================================================
      // PASSPORT
      // =================================================

      appendValue(formData, "passportNumber", values.passportNumber);

      appendValue(formData, "passportExpiryDate", values.passportExpiryDate);

      appendValue(formData, "statusOfResidence", values.statusOfResidence);

      // =================================================
      // EDUCATION
      // =================================================

      appendValue(formData, "lastQualification", values.lastQualification);

      appendValue(
        formData,
        "japaneseLanguageLevel",
        values.japaneseLanguageLevel,
      );

      appendValue(formData, "schoolName", values.schoolName);

      appendValue(formData, "course", values.course);

      appendValue(formData, "intake", values.intake);

      // =================================================
      // EMPLOYMENT
      // =================================================

      appendValue(formData, "jobCategory", values.jobCategory);

      appendValue(formData, "jobTitle", values.jobTitle);

      appendValue(formData, "companyName", values.companyName);

      appendValue(formData, "workLocation", values.workLocation);

      // =================================================
      // SPONSOR
      // =================================================

      appendValue(formData, "sponsorName", values.sponsorName);

      appendValue(formData, "sponsorRelationship", values.sponsorRelationship);

      appendValue(
        formData,
        "sponsorStatusOfResidence",
        values.sponsorStatusOfResidence,
      );

      // =================================================
      // VISA
      // =================================================

      appendValue(formData, "visaStatus", values.visaStatus);

      // =================================================
      // NEW FILES
      //
      // If user doesn't select new file,
      // existing file stays unchanged.
      // =================================================

      if (values.clientImage) {
        formData.append("clientImage", values.clientImage);
      }

      if (values.cv) {
        formData.append("cv", values.cv);
      }

      // =================================================
      // UPDATE
      // =================================================

      await updateClient(formData);

      router.push(`/admin/client`);
    } catch (error) {
      console.error("Update client error:", error);

      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || "Failed to update client.",
        );

        return;
      }

      setServerError("Failed to update client.");
    }
  };

  // =================================================
  // CANCEL
  // =================================================

  const handleCancel = () => {
    if (clientId) {
      router.push(
        `/admin/client/clientDetailPage?clientId=${encodeURIComponent(
          clientId,
        )}`,
      );

      return;
    }

    router.push("/admin/client");
  };

  // =================================================
  // QUERY ERROR MESSAGE
  // =================================================

  let loadError = "";

  if (!clientId) {
    loadError = "Client ID is missing.";
  } else if (isClientError) {
    if (axios.isAxiosError(clientError)) {
      loadError =
        clientError.response?.data?.message || "Failed to load client.";
    } else {
      loadError = "Failed to load client.";
    }
  }

  return {
    clientId,

    user,
    role,

    client,

    control,
    errors,
    handleSubmit,

    staffOptions,
    isStaffLoading,

    isClientLoading,

    isSubmitting,
    isUpdating,

    serverError,
    loadError,

    currentClientImage: client?.profile?.clientImage ?? "",

    currentCv: client?.profile?.cv ?? "",

    onSubmit,
    handleCancel,
  };
};
