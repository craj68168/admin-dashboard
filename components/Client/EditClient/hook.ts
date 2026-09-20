"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

import { createEditClientSchema } from "./validation";

import type {
  ClientDetailsResponse,
  EditClientFormValues,
  StaffListResponse,
} from "./type";

// =================================================
// DATE -> YYYY-MM-DD
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
// APPEND OPTIONAL STRING VALUE
// =================================================

const appendValue = (
  formData: FormData,
  key: string,
  value: string,
) => {
  const cleaned = value.trim();

  if (cleaned !== "") {
    formData.append(key, cleaned);
  }
};

// =================================================
// EDIT CLIENT HOOK
// =================================================

export const useEditClientHook = () => {
  const t = useTranslations("editClient");

  const router = useRouter();

  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const clientId =
    searchParams.get("clientId") ?? "";

  const user = useAuthStore(
    (state) => state.user,
  );

  const role = user?.role;

  const [serverError, setServerError] =
    useState("");

  // =================================================
  // FORM
  // =================================================

  const {
    control,
    handleSubmit,
    reset,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<EditClientFormValues>({
    resolver: zodResolver(
      createEditClientSchema({
        emailInvalid: t(
          "validation.emailInvalid",
        ),

        invalidFile: t(
          "validation.invalidFile",
        ),

        fullNameRequired: t(
          "validation.fullNameRequired",
        ),

        fullNameMin: t(
          "validation.fullNameMin",
        ),

        phoneRequired: t(
          "validation.phoneRequired",
        ),

        phoneMin: t(
          "validation.phoneMin",
        ),

        phoneMax: t(
          "validation.phoneMax",
        ),

        currentVisaStatusRequired: t(
          "validation.currentVisaStatusRequired",
        ),

        currentStageRequired: t(
          "validation.currentStageRequired",
        ),

        assignedStaffRequired: t(
          "validation.assignedStaffRequired",
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

      preferCategory: "",

      currentStage: "",

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

      education: [
        {
          schoolName: "",

          enrollmentDate: "",

          graduationDate: "",

          educationType: "",

          major: "",
        },
      ],

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
      // REPLACEMENT FILES
      // =================================================

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
      const response =
        await api.get<ClientDetailsResponse>(
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

    // =================================================
    // EMPLOYMENT HISTORY
    // =================================================

const employmentHistory: EditClientFormValues["employmentHistory"] =
  profile?.employmentHistory?.length
    ? profile.employmentHistory.map((employment) => ({
        companyName: employment.companyName ?? "",
        startDate: toDateInputValue(employment.startDate),
        endDate: toDateInputValue(employment.endDate),
        employmentType: employment.employmentType ?? "",
      }))
    : [
        {
          companyName: "",
          startDate: "",
          endDate: "",
          employmentType: "",
        },
      ];

    const profileEducation =
      profile?.education;

    const education: EditClientFormValues["education"] =
      Array.isArray(profileEducation) &&
      profileEducation.length > 0
        ? profileEducation.map((item) => ({
            schoolName: item.schoolName ?? "",
            enrollmentDate: toDateInputValue(item.enrollmentDate),
            graduationDate: toDateInputValue(item.graduationDate),
            educationType: item.educationType ?? "",
            major: item.major ?? "",
          }))
        : profileEducation && !Array.isArray(profileEducation)
          ? [
              {
                schoolName: profileEducation.schoolName ?? "",
                enrollmentDate: toDateInputValue(
                  profileEducation.enrollmentDate,
                ),
                graduationDate: toDateInputValue(
                  profileEducation.graduationDate,
                ),
                educationType: profileEducation.educationType ?? "",
                major: profileEducation.major ?? "",
              },
            ]
          : [
              {
                schoolName: "",
                enrollmentDate: "",
                graduationDate: "",
                educationType: "" as const,
                major: "",
              },
            ];

    reset({
      // =================================================
      // CLIENT
      // =================================================

      fullName:
        client.fullName ?? "",

      phone:
        client.phone ?? "",

      currentVisaStatus:
        client.currentVisaStatus ?? "",

      preferCategory:
        client.preferCategory ?? "",

      currentStage:
        client.currentStage ?? "",

      assignedStaff:
        client.assignedStaff ?? "",

      // =================================================
      // PERSONAL
      // =================================================

      dateOfBirth:
        toDateInputValue(
          profile?.dateOfBirth,
        ),

      gender:
        profile?.gender ?? "",

      email:
        profile?.email ?? "",

      nationality:
        profile?.nationality ?? "",

      address:
        profile?.address ?? "",

      prefecture:
        profile?.prefecture ?? "",

      // =================================================
      // PASSPORT / RESIDENCE
      // =================================================

      passportNumber:
        profile?.passportNumber ?? "",

      passportExpiryDate:
        toDateInputValue(
          profile?.passportExpiryDate,
        ),

      statusOfResidence:
        profile?.statusOfResidence ?? "",

      // =================================================
      // EDUCATION
      // =================================================

      education,

      japaneseLanguageLevel:
        profile?.japaneseLanguageLevel ??
        "",

      intake:
        profile?.intake ?? "",

      // =================================================
      // EMPLOYMENT HISTORY
      // =================================================

      employmentHistory,

      // =================================================
      // OTHER
      // =================================================

      remark:
        profile?.remark ?? "",

      // =================================================
      // FILES
      //
      // Existing file paths must not be put into
      // File fields.
      // =================================================

      clientImage: null,

      cv: null,
    });
  }, [client, reset]);

  // =================================================
  // STAFF LIST
  // ONLY SUPER ADMIN FETCHES STAFF LIST
  // =================================================

  const {
    data: staffResponse,
    isLoading: isStaffLoading,
  } = useQuery({
    queryKey: ["staffList"],

    queryFn: async () => {
      const response =
        await api.get<StaffListResponse>(
          "/staff",
        );

      return response.data;
    },

    enabled: role === "superadmin",
  });

  // =================================================
  // STAFF OPTIONS
  //
  // Active staff +
  // currently assigned staff even if inactive.
  // =================================================

  const staffOptions = useMemo(() => {
    const staffList =
      staffResponse?.data ?? [];

    return staffList.filter(
      (staff) =>
        staff.isActive === true ||
        staff.staffId ===
          client?.assignedStaff,
    );
  }, [
    staffResponse,
    client?.assignedStaff,
  ]);

  // =================================================
  // UPDATE CLIENT
  // =================================================

  const {
    mutateAsync: updateClient,

    isPending: isUpdating,
  } = useMutation({
    mutationFn: async (
      formData: FormData,
    ) => {
      const response =
        await api.patch(
          `/clients/${clientId}`,
          formData,
        );

      return response.data;
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clients"],
      });

      void queryClient.invalidateQueries({
        queryKey: [
          "client",
          clientId,
        ],
      });

      void queryClient.invalidateQueries({
        queryKey: ["staffList"],
      });

      void queryClient.invalidateQueries({
        queryKey: ["staff-clients"],
      });
    },
  });

  // =================================================
  // SUBMIT
  // =================================================

  const onSubmit = async (
    values: EditClientFormValues,
  ) => {
    try {
      setServerError("");

      if (!clientId) {
        setServerError(
          t("messages.clientIdMissing"),
        );

        return;
      }

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
        "currentStage",
        values.currentStage,
      );

      // =================================================
      // PREFERRED CATEGORY
      // =================================================

      appendValue(
        formData,
        "preferCategory",
        values.preferCategory,
      );

      // =================================================
      // STAFF ASSIGNMENT
      //
      // Only Super Admin can reassign.
      // Only send when changed.
      // =================================================

      if (
        role === "superadmin" &&
        values.assignedStaff !==
          client?.assignedStaff
      ) {
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
      // JAPANESE LANGUAGE
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

      const cleanedEducation =
        values.education.filter(
          (education) =>
            education.schoolName.trim() !==
              "" ||
            education.enrollmentDate.trim() !==
              "" ||
            education.graduationDate.trim() !==
              "" ||
            education.educationType !== "" ||
            education.major.trim() !== "",
        );

      formData.append(
        "education",
        JSON.stringify(
          cleanedEducation,
        ),
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
      // NEW FILES
      //
      // If user doesn't select a replacement,
      // existing file remains unchanged.
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
      // UPDATE
      // =================================================

      await updateClient(formData);

      router.push("/admin/client");
    } catch (error) {
      console.error(
        "Update client error:",
        error,
      );

      if (
        axios.isAxiosError(error)
      ) {
        setServerError(
          error.response?.data
            ?.message ||
            t(
              "messages.updateFailed",
            ),
        );

        return;
      }

      setServerError(
        t("messages.updateFailed"),
      );
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
  // CLIENT LOAD ERROR
  // =================================================

  let loadError = "";

  if (!clientId) {
    loadError = t(
      "messages.clientIdMissing",
    );
  } else if (isClientError) {
    if (
      axios.isAxiosError(clientError)
    ) {
      loadError =
        clientError.response?.data
          ?.message ||
        t("messages.loadFailed");
    } else {
      loadError = t(
        "messages.loadFailed",
      );
    }
  }

  // =================================================
  // RETURN
  // =================================================

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

    currentClientImage:
      client?.profile?.clientImage ??
      "",

    currentCv:
      client?.profile?.cv ?? "",

    onSubmit,
    handleCancel,
  };
};
