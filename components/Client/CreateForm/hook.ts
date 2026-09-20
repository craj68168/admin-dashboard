"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { createClientFormSchema } from "./validation";
import type {
  ClientDetailsResponse,
  ClientFormValues,
  ClientSaveResponse,
  ClientStageListResponse,
  ClientStageOption,
  ExistingClientFiles,
  StaffListResponse,
} from "./type";
// =================================================
// EMPTY EDUCATION
// =================================================
const emptyEducation = () => ({
  schoolName: "",
  enrollmentDate: "",
  graduationDate: "",
  educationType: "" as const,
  major: "",
});
// =================================================
// EMPTY EMPLOYMENT
// =================================================
const emptyEmployment = () => ({
  companyName: "",
  startDate: "",
  endDate: "",
  employmentType: "" as const,
});
// =================================================
// DEFAULT VALUES
// =================================================
const getDefaultValues = (): ClientFormValues => ({
  fullName: "",
  phone: "",
  currentVisaStatus: "",
  assignedStaff: "",
  preferCategory: "otherVisaService",
  currentStage: "registeredPaid",
  dateOfBirth: "",
  gender: "",
  email: "",
  nationality: "",
  address: "",
  prefecture: "",
  passportNumber: "",
  passportExpiryDate: "",
  statusOfResidence: "",
  education: [emptyEducation()],
  japaneseLanguageLevel: "",
  intake: "",
  employmentHistory: [emptyEmployment()],
  clientImage: null,
  cv: null,
});
// =================================================
// DATE → HTML DATE INPUT
// =================================================
const formatDateInput = (value?: string | null) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
};
// =================================================
// APPEND STRING
// =================================================
const appendValue = (formData: FormData, key: string, value: string) => {
  formData.append(key, value.trim());
};
// =================================================
// API ERROR
// =================================================
const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};
// =================================================
// HOOK
// =================================================
export const useClientFormHook = (clientId?: string) => {
  const t = useTranslations("createClient");
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const isEditMode = Boolean(clientId);
  const [serverError, setServerError] = useState("");
  // =================================================
  // FORM
  // =================================================
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(
      createClientFormSchema({
        fullNameRequired: t("validation.fullNameRequired"),
        phoneRequired: t("validation.phoneRequired"),
        currentVisaStatusRequired: t("validation.currentVisaStatusRequired"),
        assignedStaffRequired: "Assigned staff is required",
        currentStageRequired: t("validation.currentStageRequired"),
        employmentTypeRequired: "Employment type is required",
      }),
    ),
    defaultValues: getDefaultValues(),
  });
  // =================================================
  // EXISTING CLIENT
  // =================================================
  const {
    data: clientResponse,
    isLoading: isClientLoading,
    isFetching: isClientFetching,
    isError: isClientError,
    error: clientError,
  } = useQuery<ClientDetailsResponse>({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const response = await api.get<ClientDetailsResponse>(
        `/clients/${encodeURIComponent(clientId!)}`,
      );
      return response.data;
    },
    enabled: isEditMode && Boolean(clientId),
  });
  const client = clientResponse?.data;
  // =================================================
  // ACTIVE STAGES
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
  // =================================================
  // STAGE OPTIONS
  // Include current inactive stage in Edit mode.
  // =================================================
  const stageOptions = useMemo<ClientStageOption[]>(() => {
    const activeStages = [...(stageResponse?.data ?? [])];
    const currentStage = client?.currentStage;
    const currentStageDetails = client?.currentStageDetails;
    if (
      isEditMode &&
      currentStage &&
      !activeStages.some((stage) => stage.key === currentStage)
    ) {
      if (currentStageDetails) {
        activeStages.push(currentStageDetails);
      } else {
        activeStages.push({
          _id: `current-${currentStage}`,
          key: currentStage,
          name: client?.clientStatus || currentStage,
          amount: 0,
          isActive: false,
          isSystem: false,
          displayOrder: 9999,
        });
      }
    }
    return activeStages.sort((a, b) => a.displayOrder - b.displayOrder);
  }, [stageResponse, client, isEditMode]);
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
  const activeStaff = useMemo(() => {
    const staff = staffResponse?.data ?? [];
    if (
      isEditMode &&
      client?.assignedStaffDetails &&
      !staff.some(
        (item) => item.staffId === client.assignedStaffDetails?.staffId,
      )
    ) {
      return [
        client.assignedStaffDetails,
        ...staff.filter((item) => item.isActive),
      ];
    }
    return staff.filter((item) => item.isActive);
  }, [staffResponse, client, isEditMode]);
  // =================================================
  // AUTO ASSIGN STAFF DURING CREATE
  // =================================================
  useEffect(() => {
    if (!isEditMode && role === "staff" && user?.staffId) {
      setValue("assignedStaff", String(user.staffId), {
        shouldValidate: true,
      });
    }
  }, [isEditMode, role, user?.staffId, setValue]);
  // =================================================
  // DEFAULT CREATE STAGE
  // =================================================
  useEffect(() => {
    if (isEditMode || stageOptions.length === 0) {
      return;
    }
    const currentStage = getValues("currentStage");
    const exists = stageOptions.some((stage) => stage.key === currentStage);
    if (!exists) {
      const registeredPaid = stageOptions.find(
        (stage) => stage.key === "registeredPaid",
      );
      setValue("currentStage", registeredPaid?.key ?? stageOptions[0].key, {
        shouldValidate: true,
      });
    }
  }, [isEditMode, stageOptions, getValues, setValue]);
  // =================================================
  // PREFILL EDIT FORM
  // =================================================
  useEffect(() => {
    if (!isEditMode || !client) {
      return;
    }
    const profile = client.profile;
    reset({
      fullName: client.fullName ?? "",
      phone: client.phone ?? "",
      currentVisaStatus: client.currentVisaStatus ?? "",
      assignedStaff: client.assignedStaff ?? "",
      preferCategory: client.preferCategory ?? "",
      currentStage: client.currentStage ?? "",
      dateOfBirth: formatDateInput(profile?.dateOfBirth),
      gender: profile?.gender ?? "",
      email: profile?.email ?? "",
      nationality: profile?.nationality ?? "",
      address: profile?.address ?? "",
      prefecture: profile?.prefecture ?? "",
      passportNumber: profile?.passportNumber ?? "",
      passportExpiryDate: formatDateInput(profile?.passportExpiryDate),
      statusOfResidence: profile?.statusOfResidence ?? "",
      education:
        profile?.education && profile.education.length > 0
          ? profile.education.map((education) => ({
              schoolName: education.schoolName ?? "",
              enrollmentDate: formatDateInput(education.enrollmentDate),
              graduationDate: formatDateInput(education.graduationDate),
              educationType: education.educationType ?? "",
              major: education.major ?? "",
            }))
          : [emptyEducation()],
      japaneseLanguageLevel: profile?.japaneseLanguageLevel ?? "",
      intake: profile?.intake ?? "",
      employmentHistory:
        profile?.employmentHistory && profile.employmentHistory.length > 0
          ? profile.employmentHistory.map((employment) => ({
              companyName: employment.companyName ?? "",
              startDate: formatDateInput(employment.startDate),
              endDate: formatDateInput(employment.endDate),
              employmentType: employment.employmentType ?? "",
            }))
          : [emptyEmployment()],
      clientImage: null,
      cv: null,
    });
  }, [isEditMode, client, reset]);
  // =================================================
  // EXISTING FILES
  // =================================================
  const existingFiles = useMemo<ExistingClientFiles>(
    () => ({
      clientImage: client?.profile?.clientImage ?? "",
      cv: client?.profile?.cv ?? "",
    }),
    [client],
  );
  // =================================================
  // SAVE MUTATION
  // =================================================
  const { mutateAsync: saveClient, isPending: isSaving } = useMutation<
    ClientSaveResponse,
    unknown,
    FormData
  >({
    mutationFn: async (formData) => {
      if (isEditMode && clientId) {
        const response = await api.patch<ClientSaveResponse>(
          `/clients/${encodeURIComponent(clientId)}`,
          formData,
        );
        return response.data;
      }
      const response = await api.post<ClientSaveResponse>("/clients", formData);
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["clients"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["staffClients"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["staffList"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["staff"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["adminDashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["staffDashboard"],
        }),
      ]);
      if (clientId) {
        await queryClient.invalidateQueries({
          queryKey: ["client", clientId],
        });
      }
    },
  });
  // =================================================
  // SUBMIT
  // =================================================
  const onSubmit = async (values: ClientFormValues) => {
    try {
      setServerError("");
      const formData = new FormData();
      // =================================================
      // REQUIRED CLIENT
      // =================================================
      appendValue(formData, "fullName", values.fullName);
      appendValue(formData, "phone", values.phone);
      appendValue(formData, "currentVisaStatus", values.currentVisaStatus);
      // =================================================
      // PREFERRED CATEGORY
      // =================================================
      appendValue(formData, "preferCategory", values.preferCategory);
      // =================================================
      // STAGE
      // CREATE ONLY.
      // Edit stage changes must go through Progress.
      // =================================================
      if (!isEditMode) {
        appendValue(formData, "currentStage", values.currentStage);
      }
      // =================================================
      // ASSIGNED STAFF
      // Admin can select/reassign.
      // Staff never sends assignment.
      // =================================================
      if (role === "superadmin") {
        appendValue(formData, "assignedStaff", values.assignedStaff);
      }
      // =================================================
      // PERSONAL
      // =================================================
      appendValue(formData, "dateOfBirth", values.dateOfBirth);
      appendValue(formData, "gender", values.gender);
      appendValue(formData, "email", values.email);
      appendValue(formData, "nationality", values.nationality);
      appendValue(formData, "address", values.address);
      appendValue(formData, "prefecture", values.prefecture);
      // =================================================
      // PASSPORT
      // =================================================
      appendValue(formData, "passportNumber", values.passportNumber);
      appendValue(formData, "passportExpiryDate", values.passportExpiryDate);
      appendValue(formData, "statusOfResidence", values.statusOfResidence);
      // =================================================
      // EDUCATION
      // =================================================
      const cleanedEducation = values.education.filter(
        (education) =>
          education.schoolName.trim() !== "" ||
          education.enrollmentDate.trim() !== "" ||
          education.graduationDate.trim() !== "" ||
          education.educationType !== "" ||
          education.major.trim() !== "",
      );
      formData.append("education", JSON.stringify(cleanedEducation));
      // =================================================
      // JAPANESE
      // =================================================
      appendValue(
        formData,
        "japaneseLanguageLevel",
        values.japaneseLanguageLevel,
      );
      appendValue(formData, "intake", values.intake);
      // =================================================
      // EMPLOYMENT
      // =================================================
      const cleanedEmploymentHistory = values.employmentHistory.filter(
        (employment) =>
          employment.companyName.trim() !== "" ||
          employment.startDate.trim() !== "" ||
          employment.endDate.trim() !== "" ||
          employment.employmentType !== "",
      );
      formData.append(
        "employmentHistory",
        JSON.stringify(cleanedEmploymentHistory),
      );
      // =================================================
      // FILES
      // Existing files are kept if no new file is selected.
      // =================================================
      if (values.clientImage) {
        formData.append("clientImage", values.clientImage);
      }
      if (values.cv) {
        formData.append("cv", values.cv);
      }
      // =================================================
      // SAVE
      // =================================================
      const response = await saveClient(formData);
      const savedClientId = response.data?.clientId || clientId;
      if (isEditMode && savedClientId) {
        router.push(`/admin/client/${encodeURIComponent(savedClientId)}`);
        return;
      }
      router.push("/admin/client");
    } catch (error) {
      console.error("Save client error:", error);
      setServerError(
        getApiErrorMessage(
          error,
          isEditMode ? "Failed to update client." : t("messages.createFailed"),
        ),
      );
    }
  };
  // =================================================
  // CANCEL
  // =================================================
  const handleCancel = () => {
    if (isEditMode && clientId) {
      router.push(`/admin/client/${encodeURIComponent(clientId)}`);
      return;
    }
    router.push("/admin/client");
  };
  // =================================================
  // LOAD ERRORS
  // =================================================
  const clientLoadError = isClientError
    ? getApiErrorMessage(clientError, "Failed to load client.")
    : "";
  const stageLoadError = isStageError
    ? getApiErrorMessage(stageError, "Failed to load client stages.")
    : "";
  // =================================================
  // RETURN
  // =================================================
  return {
    user,
    role,
    isEditMode,
    clientId,
    client,
    control,
    errors,
    handleSubmit,
    activeStaff,
    stageOptions,
    existingFiles,
    isStaffLoading,
    isStageLoading,
    isClientLoading: isClientLoading || isClientFetching,
    isSubmitting,
    isSaving,
    serverError,
    clientLoadError,
    stageLoadError,
    onSubmit,
    handleCancel,
  };
};
