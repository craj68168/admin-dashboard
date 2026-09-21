"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

import { clientFormSchema } from "./validation";

import type {
  ClientDetailsResponse,
  ClientFormValues,
  ClientSaveResponse,
  ClientStageListResponse,
  StaffListResponse,
} from "./type";

const REGISTRATION_STAGE_KEY = "registeredPaid";

// =================================================
// TODAY
// =================================================

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =================================================
// DEFAULT
// =================================================

const defaultValues: ClientFormValues = {
  fullName: "",
  furigana: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",

  postalCode: "",
  prefecture: "",
  address: "",

  currentVisaStatus: "",
  residenceExpiryDate: "",
  passportNumber: "",
  passportExpiryDate: "",

  preferCategory: "otherVisaService",
  assignedStaff: "",
  intake: "",

  education: [],

  japaneseLanguageLevel: "",
  qualifications: [],
  skillsText: "",

  employmentHistory: [],

  careerSummary: "",
  motivation: "",
  selfPR: "",
  desiredConditions: "",

  paymentMethod: "",
  paymentDate: getToday(),
  bankName: "",
  referenceNumber: "",
  receiptNumber: "",
  paymentNote: "",

  clientImage: undefined,
  cv: undefined,
};

// =================================================
// HELPERS
// =================================================

const toDateInput = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

const nullableDate = (value?: string) => {
  const trimmed = String(value || "").trim();
  return trimmed || null;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

// =================================================
// HOOK
// =================================================

export const useClientFormHook = (clientId?: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const role = user?.role;

  const isEditMode = Boolean(clientId);

  const [submitError, setSubmitError] = useState("");

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = form;

  // =================================================
  // CLIENT DETAIL
  // =================================================

  const {
    data: clientResponse,
    isLoading: isClientLoading,
    isFetching: isClientFetching,
  } = useQuery<ClientDetailsResponse>({
    queryKey: ["client", clientId],

    queryFn: async () => {
      const response = await api.get<ClientDetailsResponse>(
        `/clients/${encodeURIComponent(clientId!)}`,
      );

      return response.data;
    },

    enabled: isEditMode,
  });

  const client = clientResponse?.data;

  const profile = client?.profile;

  // =================================================
  // STAGES
  // =================================================

  const {
    data: stageResponse,
    isLoading: isStageLoading,
    isError: isStageError,
    error: stageError,
  } = useQuery<ClientStageListResponse>({
    queryKey: ["clientStageOptions"],

    queryFn: async () => {
      const response = await api.get<ClientStageListResponse>("/stages");

      return response.data;
    },
  });

  const registrationStage = useMemo(() => {
    return (stageResponse?.data ?? []).find(
      (stage) => stage.key === REGISTRATION_STAGE_KEY && stage.isActive,
    );
  }, [stageResponse]);

  const registrationAmount = Number(registrationStage?.amount || 0);

  let registrationConfigError = "";

  if (!isEditMode && isStageError) {
    registrationConfigError = getErrorMessage(
      stageError,
      "Failed to load registration stage.",
    );
  } else if (!isEditMode && !isStageLoading && !registrationStage) {
    registrationConfigError = 'Active stage "registeredPaid" was not found.';
  } else if (!isEditMode && !isStageLoading && registrationAmount <= 0) {
    registrationConfigError =
      'The "Registered / Paid" stage must have an amount greater than ¥0.';
  }

  // =================================================
  // STAFF
  // =================================================

  const { data: staffResponse, isLoading: isStaffLoading } =
    useQuery<StaffListResponse>({
      queryKey: ["staffList"],

      queryFn: async () => {
        const response = await api.get<StaffListResponse>("/staff", {
          params: {
            page: 1,
            limit: 100,
          },
        });

        return response.data;
      },

      enabled: role === "superadmin",
    });

  const staffOptions = useMemo(() => {
    return (staffResponse?.data ?? [])
      .filter((staff) => staff.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [staffResponse]);

  // =================================================
  // STAFF AUTO ASSIGN
  // =================================================

  useEffect(() => {
    if (!isEditMode && role === "staff" && user?.staffId) {
      setValue("assignedStaff", user.staffId);
    }
  }, [isEditMode, role, user?.staffId, setValue]);

  // =================================================
  // PREFILL EDIT
  // =================================================

  useEffect(() => {
    if (!isEditMode || !client) {
      return;
    }

    reset({
      fullName: client.fullName ?? "",

      furigana: profile?.furigana ?? "",

      phone: client.phone ?? "",

      email: profile?.email ?? "",

      dateOfBirth: toDateInput(profile?.dateOfBirth),

      gender: profile?.gender ?? "",

      nationality: profile?.nationality ?? "",

      postalCode: profile?.postalCode ?? "",

      prefecture: profile?.prefecture ?? "",

      address: profile?.address ?? "",

      currentVisaStatus: client.currentVisaStatus ?? "",

      residenceExpiryDate: toDateInput(profile?.residenceExpiryDate),

      passportNumber: profile?.passportNumber ?? "",

      passportExpiryDate: toDateInput(profile?.passportExpiryDate),

      preferCategory: client.preferCategory || "otherVisaService",

      assignedStaff: client.assignedStaff ?? "",

      intake: profile?.intake ?? "",

      education: (profile?.education ?? []).map((item) => ({
        schoolName: item.schoolName ?? "",

        educationType: item.educationType ?? "",

        enrollmentDate: toDateInput(item.enrollmentDate),

        graduationDate: toDateInput(item.graduationDate),

        graduationStatus: item.graduationStatus ?? "",

        major: item.major ?? "",
      })),

      japaneseLanguageLevel: profile?.japaneseLanguageLevel ?? "",

      qualifications: (profile?.qualifications ?? []).map((item) => ({
        name: item.name ?? "",

        levelOrScore: item.levelOrScore ?? "",

        acquiredDate: toDateInput(item.acquiredDate),

        expiryDate: toDateInput(item.expiryDate),

        issuer: item.issuer ?? "",

        note: item.note ?? "",
      })),

      skillsText: (profile?.skills ?? []).join(", "),

      employmentHistory: (profile?.employmentHistory ?? []).map((item) => ({
        companyName: item.companyName ?? "",

        employmentType: item.employmentType ?? "",

        department: item.department ?? "",

        jobTitle: item.jobTitle ?? "",

        workLocation: item.workLocation ?? "",

        startDate: toDateInput(item.startDate),

        endDate: toDateInput(item.endDate),

        isCurrent: Boolean(item.isCurrent),

        responsibilities: item.responsibilities ?? "",

        achievements: item.achievements ?? "",
      })),

      careerSummary: profile?.careerSummary ?? "",

      motivation: profile?.motivation ?? "",

      selfPR: profile?.selfPR ?? "",

      desiredConditions: profile?.desiredConditions ?? "",

      // Registration payment is create-only
      paymentMethod: "",
      paymentDate: getToday(),
      bankName: "",
      referenceNumber: "",
      receiptNumber: "",
      paymentNote: "",

      clientImage: undefined,
      cv: undefined,
    });
  }, [isEditMode, client, profile, reset]);

  // =================================================
  // MUTATION
  // =================================================

  const { mutateAsync: saveClient, isPending: isSaving } = useMutation<
    ClientSaveResponse,
    unknown,
    FormData
  >({
    mutationFn: async (formData) => {
      if (isEditMode) {
        const response = await api.patch<ClientSaveResponse>(
          `/clients/${encodeURIComponent(clientId!)}`,
          formData,
        );

        return response.data;
      }

      const response = await api.post<ClientSaveResponse>("/clients", formData);

      return response.data;
    },
  });

  const appendValue = (formData: FormData, key: string, value: unknown) => {
    if (value === undefined || value === null) {
      return;
    }

    formData.append(key, String(value));
  };

  const normalizeEducation = (values: ClientFormValues["education"]) => {
    return values.map((item) => ({
      schoolName: item.schoolName?.trim() ?? "",

      educationType: item.educationType?.trim() ?? "",

      enrollmentDate: nullableDate(item.enrollmentDate),

      graduationDate: nullableDate(item.graduationDate),

      graduationStatus: item.graduationStatus ?? "",

      major: item.major?.trim() ?? "",
    }));
  };

  const normalizeQualifications = (
    values: ClientFormValues["qualifications"],
  ) => {
    return values.map((item) => ({
      name: item.name?.trim() ?? "",

      levelOrScore: item.levelOrScore?.trim() ?? "",

      acquiredDate: nullableDate(item.acquiredDate),

      expiryDate: nullableDate(item.expiryDate),

      issuer: item.issuer?.trim() ?? "",

      note: item.note?.trim() ?? "",
    }));
  };

  const normalizeEmployment = (
    values: ClientFormValues["employmentHistory"],
  ) => {
    return values.map((item) => ({
      companyName: item.companyName?.trim() ?? "",

      employmentType: item.employmentType?.trim() ?? "",

      department: item.department?.trim() ?? "",

      jobTitle: item.jobTitle?.trim() ?? "",

      workLocation: item.workLocation?.trim() ?? "",

      startDate: nullableDate(item.startDate),

      endDate: item.isCurrent ? null : nullableDate(item.endDate),

      isCurrent: Boolean(item.isCurrent),

      responsibilities: item.responsibilities?.trim() ?? "",

      achievements: item.achievements?.trim() ?? "",
    }));
  };

  const normalizeSkills = (value?: string) => {
    return String(value || "")
      .split(/[,\n]/)
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  // =================================================
  // SUBMIT
  // =================================================

  const onSubmit = async (values: ClientFormValues) => {
    setSubmitError("");

    // =================================================
    // ADMIN STAFF ASSIGNMENT
    // =================================================

    if (role === "superadmin" && !values.assignedStaff) {
      setError("assignedStaff", {
        type: "manual",
        message: "Please select an assigned staff member.",
      });

      return;
    }

    // =================================================
    // CREATE REGISTRATION PAYMENT
    // =================================================

    if (!isEditMode) {
      if (!registrationStage || registrationAmount <= 0) {
        setSubmitError(
          registrationConfigError ||
            "Registration stage is not configured correctly.",
        );

        return;
      }

      if (!values.paymentMethod) {
        setError("paymentMethod", {
          type: "manual",
          message: "Payment method is required.",
        });

        return;
      }

      if (!values.paymentDate) {
        setError("paymentDate", {
          type: "manual",
          message: "Payment date is required.",
        });

        return;
      }
    }

    try {
      const formData = new FormData();

      // =================================================
      // CLIENT
      // =================================================

      appendValue(formData, "fullName", values.fullName.trim());

      appendValue(formData, "phone", values.phone.trim());

      appendValue(formData, "currentVisaStatus", values.currentVisaStatus);

      appendValue(formData, "preferCategory", values.preferCategory);

      if (role === "superadmin") {
        appendValue(formData, "assignedStaff", values.assignedStaff ?? "");
      }

      // =================================================
      // PROFILE
      // =================================================

      appendValue(formData, "furigana", values.furigana ?? "");

      appendValue(formData, "email", values.email ?? "");

      appendValue(formData, "dateOfBirth", values.dateOfBirth ?? "");

      appendValue(formData, "gender", values.gender ?? "");

      appendValue(formData, "nationality", values.nationality ?? "");

      appendValue(formData, "postalCode", values.postalCode ?? "");

      appendValue(formData, "prefecture", values.prefecture ?? "");

      appendValue(formData, "address", values.address ?? "");

      appendValue(
        formData,
        "residenceExpiryDate",
        values.residenceExpiryDate ?? "",
      );

      appendValue(formData, "passportNumber", values.passportNumber ?? "");

      appendValue(
        formData,
        "passportExpiryDate",
        values.passportExpiryDate ?? "",
      );

      appendValue(formData, "intake", values.intake ?? "");

      formData.append(
        "education",
        JSON.stringify(normalizeEducation(values.education)),
      );

      appendValue(
        formData,
        "japaneseLanguageLevel",
        values.japaneseLanguageLevel ?? "",
      );

      formData.append(
        "qualifications",
        JSON.stringify(normalizeQualifications(values.qualifications)),
      );

      formData.append(
        "skills",
        JSON.stringify(normalizeSkills(values.skillsText)),
      );

      formData.append(
        "employmentHistory",
        JSON.stringify(normalizeEmployment(values.employmentHistory)),
      );

      appendValue(formData, "careerSummary", values.careerSummary ?? "");

      appendValue(formData, "motivation", values.motivation ?? "");

      appendValue(formData, "selfPR", values.selfPR ?? "");

      appendValue(
        formData,
        "desiredConditions",
        values.desiredConditions ?? "",
      );

      // =================================================
      // REGISTRATION PAYMENT - CREATE ONLY
      //
      // NO AMOUNT IS SENT.
      // Backend reads Stage.amount.
      // =================================================

      if (!isEditMode) {
        appendValue(formData, "paymentMethod", values.paymentMethod);

        appendValue(formData, "paymentDate", values.paymentDate);

        appendValue(formData, "bankName", values.bankName ?? "");

        appendValue(formData, "referenceNumber", values.referenceNumber ?? "");

        appendValue(formData, "receiptNumber", values.receiptNumber ?? "");

        appendValue(formData, "paymentNote", values.paymentNote ?? "");
      }

      // =================================================
      // FILES
      // =================================================

      if (values.clientImage instanceof File) {
        formData.append("clientImage", values.clientImage);
      }

      if (values.cv instanceof File) {
        formData.append("cv", values.cv);
      }
      // SAVE

      const response = await saveClient(formData);

      const savedClientId = response.data.clientId || clientId;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["clients"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["client"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["clientPayments"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["clientProgress"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staffClients"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["adminDashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staffDashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staffTarget"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staffPerformance"],
        }),
      ]);

      toast.success(
        response.message ||
          (isEditMode
            ? "Client updated successfully."
            : `¥${registrationAmount.toLocaleString()} registration payment confirmed and client created.`),
      );

      if (savedClientId) {
        router.push(`/admin/client/${encodeURIComponent(savedClientId)}`);

        return;
      }

      router.push("/admin/client");
    } catch (error) {
      console.error("SAVE CLIENT ERROR:", error);

      const message = getErrorMessage(
        error,
        isEditMode ? "Failed to update client." : "Failed to register client.",
      );

      setSubmitError(message);

      toast.error(message);
    }
  };

  return {
    isEditMode,
    role,
    user,

    control,
    register,
    handleSubmit,
    setValue,
    watch,
    errors,

    onSubmit,

    client,
    profile,

    existingClientImage: profile?.clientImage ?? "",

    existingCv: profile?.cv ?? "",

    registrationStage,
    registrationAmount,
    registrationConfigError,

    isStageLoading,

    staffOptions,
    isStaffLoading,

    isLoading: isEditMode && (isClientLoading || isClientFetching),

    isSaving,
    submitError,

    handleCancel: () => {
      if (clientId) {
        router.push(`/admin/client/${encodeURIComponent(clientId)}`);

        return;
      }

      router.push("/admin/client");
    },
  };
};
