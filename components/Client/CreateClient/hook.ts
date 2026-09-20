"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import axios from "axios";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

import type {
  CreateClientFormValues,
  StaffListResponse,
} from "./type";

import { createCreateClientSchema } from "./validation";

// =================================================
// APPEND FORM DATA
// Empty optional string fields are not sent.
// =================================================

const appendValue = (
  formData: FormData,
  key: string,
  value: string,
) => {
  const cleanValue = value.trim();

  if (cleanValue !== "") {
    formData.append(key, cleanValue);
  }
};

// =================================================
// CREATE CLIENT HOOK
// =================================================

export const useCreateClientHook = () => {
  const t = useTranslations("createClient");

  const router = useRouter();

  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const role = user?.role;

  const [serverError, setServerError] = useState("");

  // =================================================
  // FORM
  // =================================================

  const {
    control,
    handleSubmit,
    setValue,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CreateClientFormValues>({
    resolver: zodResolver(
      createCreateClientSchema({
        fullNameRequired: t("validation.fullNameRequired"),

        phoneRequired: t("validation.phoneRequired"),

        currentVisaStatusRequired: t(
          "validation.currentVisaStatusRequired",
        ),

        currentStageRequired: t(
          "validation.currentStageRequired",
        ),
      }),
    ),

    defaultValues: {
      // =================================================
      // CLIENT
      // =================================================

      fullName: "",

      phone: "",

      currentVisaStatus: "",

      preferCategory: "otherVisaService",

      currentStage: "registeredPaid",

      assignedStaff: "",

      // =================================================
      // PERSONAL
      // =================================================

      dateOfBirth: "",

      gender: "",

      email: "",

      nationality: "",

      address: "",

      prefecture: "",

      // =================================================
      // PASSPORT / RESIDENCE
      // =================================================

      passportNumber: "",

      passportExpiryDate: "",

      statusOfResidence: "",

      // =================================================
      // EDUCATION
      // =================================================

      education: {
        schoolName: "",

        enrollmentDate: "",

        graduationDate: "",

        major: "",
      },

      japaneseLanguageLevel: "",

      intake: "",

      // =================================================
      // EMPLOYMENT HISTORY
      // =================================================

      employmentHistory: [
        {
          companyName: "",

          startDate: "",

          endDate: "",

          employmentType: "",
        },
      ],

      // =================================================
      // OTHER
      // =================================================

      remark: "",

      // =================================================
      // FILES
      // =================================================

      clientImage: null,

      cv: null,
    },
  });

  // =================================================
  // STAFF AUTO ASSIGN
  // =================================================

  useEffect(() => {
    if (role === "staff" && user?.staffId) {
      setValue("assignedStaff", user.staffId, {
        shouldValidate: true,
      });
    }
  }, [role, user?.staffId, setValue]);

  // =================================================
  // STAFF LIST
  // ONLY SUPER ADMIN calls /staff
  // =================================================

  const {
    data: staffResponse,
    isLoading: isStaffLoading,
  } = useQuery({
    queryKey: ["staffList"],

    queryFn: async () => {
      const response =
        await api.get<StaffListResponse>("/staff");

      return response.data;
    },

    enabled: role === "superadmin",
  });

  // =================================================
  // ACTIVE STAFF ONLY
  // =================================================

  const activeStaff = useMemo(() => {
    return (
      staffResponse?.data?.filter(
        (staff) => staff.isActive,
      ) ?? []
    );
  }, [staffResponse]);

  // =================================================
  // CREATE CLIENT API
  // =================================================

  const {
    mutateAsync: createClient,

    isPending: isCreating,
  } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post(
        "/clients",
        formData,
      );

      return response.data;
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["staff-clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["staffList"],
      });
    },
  });

  // =================================================
  // SUBMIT
  // =================================================

  const onSubmit = async (
    values: CreateClientFormValues,
  ) => {
    try {
      setServerError("");

      const formData = new FormData();

      // =================================================
      // REQUIRED CLIENT FIELDS
      // =================================================

      formData.append(
        "fullName",
        values.fullName.trim(),
      );

      formData.append(
        "phone",
        values.phone.trim(),
      );

      formData.append(
        "currentVisaStatus",
        values.currentVisaStatus,
      );

      formData.append(
        "preferCategory",
        values.preferCategory,
      );

      formData.append(
        "currentStage",
        values.currentStage,
      );

      // =================================================
      // STAFF ASSIGNMENT
      //
      // Super Admin manually selects.
      // Staff is assigned from authentication backend.
      // =================================================

      if (role === "superadmin") {
        formData.append(
          "assignedStaff",
          values.assignedStaff,
        );
      }

      // =================================================
      // PERSONAL
      // =================================================

      appendValue(
        formData,
        "dateOfBirth",
        values.dateOfBirth,
      );

      appendValue(
        formData,
        "gender",
        values.gender,
      );

      appendValue(
        formData,
        "email",
        values.email,
      );

      appendValue(
        formData,
        "nationality",
        values.nationality,
      );

      appendValue(
        formData,
        "address",
        values.address,
      );

      appendValue(
        formData,
        "prefecture",
        values.prefecture,
      );

      // =================================================
      // PASSPORT / RESIDENCE
      // =================================================

      appendValue(
        formData,
        "passportNumber",
        values.passportNumber,
      );

      appendValue(
        formData,
        "passportExpiryDate",
        values.passportExpiryDate,
      );

      appendValue(
        formData,
        "statusOfResidence",
        values.statusOfResidence,
      );

      // =================================================
      // JAPANESE LEVEL
      // =================================================

      appendValue(
        formData,
        "japaneseLanguageLevel",
        values.japaneseLanguageLevel,
      );

      // =================================================
      // INTAKE
      // =================================================

      appendValue(
        formData,
        "intake",
        values.intake,
      );

      // =================================================
      // EDUCATION
      // =================================================

      formData.append(
        "education",
        JSON.stringify(values.education),
      );

      // =================================================
      // EMPLOYMENT HISTORY
      // =================================================

      formData.append(
        "employmentHistory",
        JSON.stringify(
          values.employmentHistory,
        ),
      );

      // =================================================
      // REMARK
      // =================================================

      appendValue(
        formData,
        "remark",
        values.remark,
      );

      // =================================================
      // FILES
      // =================================================

      if (values.clientImage) {
        formData.append(
          "clientImage",
          values.clientImage,
        );
      }

      if (values.cv) {
        formData.append(
          "cv",
          values.cv,
        );
      }

      // =================================================
      // CREATE
      // =================================================

      await createClient(formData);

      router.push("/admin/client");
    } catch (error) {
      console.error(
        "Create client error:",
        error,
      );

      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message ||
            t("messages.createFailed"),
        );

        return;
      }

      setServerError(
        t("messages.createFailed"),
      );
    }
  };

  // =================================================
  // CANCEL
  // =================================================

  const handleCancel = () => {
    router.push("/admin/client");
  };

  // =================================================
  // RETURN
  // =================================================

  return {
    user,

    role,

    control,

    errors,

    handleSubmit,

    activeStaff,

    isStaffLoading,

    isSubmitting,

    isCreating,

    serverError,

    onSubmit,

    handleCancel,
  };
};