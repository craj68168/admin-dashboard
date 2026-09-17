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

import type { StaffListResponse } from "./type";

import {
  createCreateClientSchema,
  type CreateClientFormValues,
} from "./validation";

// =================================================
// APPEND FORM DATA
//
// Empty optional fields are not sent.
// =================================================

const appendValue = (formData: FormData, key: string, value: string) => {
  const cleanValue = value.trim();

  if (cleanValue !== "") {
    formData.append(key, cleanValue);
  }
};

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
    formState: { errors, isSubmitting },
  } = useForm<CreateClientFormValues>({
    resolver: zodResolver(
      createCreateClientSchema({
        fullNameRequired: t("validation.fullNameRequired"),
        phoneRequired: t("validation.phoneRequired"),
        visaTypeRequired: t("validation.visaTypeRequired"),
      }),
    ),

    defaultValues: {
      // Client
      fullName: "",
      phone: "",
      visaType: "",
      assignedStaff: "",
      coeStatus: "Not Applied",
      clientStatus: "New",

      // Personal
      dateOfBirth: "",
      gender: "",
      email: "",
      address: "",
      nationality: "",

      // Passport
      passportNumber: "",
      passportExpiryDate: "",
      statusOfResidence: "",

      // Education
      lastQualification: "",
      japaneseLanguageLevel: "",
      schoolName: "",
      course: "",
      intake: "",

      // Employment
      jobCategory: "",
      jobTitle: "",
      companyName: "",
      workLocation: "",

      // Sponsor
      sponsorName: "",
      sponsorRelationship: "",
      sponsorStatusOfResidence: "",

      // Visa
      visaStatus: "",

      // Files
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
  //
  // ONLY ADMIN calls /staff
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
  // ACTIVE STAFF ONLY
  // =================================================

  const activeStaff = useMemo(() => {
    return staffResponse?.data?.filter((staff) => staff.isActive) ?? [];
  }, [staffResponse]);

  // =================================================
  // CREATE CLIENT API
  // =================================================

  const {
    mutateAsync: createClient,

    isPending: isCreating,
  } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/clients", formData);

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

  const onSubmit = async (values: CreateClientFormValues) => {
    try {
      setServerError("");

      const formData = new FormData();

      // =================================================
      // REQUIRED CLIENT FIELDS
      // =================================================

      formData.append("fullName", values.fullName.trim());

      formData.append("phone", values.phone.trim());

      formData.append("visaType", values.visaType);

      // =================================================
      // ADMIN ASSIGNMENT
      //
      // Staff does NOT send this.
      // Backend automatically uses req.user.staffId.
      // =================================================

      if (role === "superadmin") {
        formData.append("assignedStaff", values.assignedStaff);
      }

      // =================================================
      // CLIENT STATUS FIELDS
      // =================================================

      formData.append("coeStatus", values.coeStatus);

      formData.append("clientStatus", values.clientStatus);

      // =================================================
      // PERSONAL
      // =================================================

      appendValue(formData, "dateOfBirth", values.dateOfBirth);

      appendValue(formData, "gender", values.gender);

      appendValue(formData, "email", values.email);

      appendValue(formData, "address", values.address);

      appendValue(formData, "nationality", values.nationality);

      // =================================================
      // PASSPORT / RESIDENCE
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
      // FILES
      // =================================================

      if (values.clientImage) {
        formData.append("clientImage", values.clientImage);
      }

      if (values.cv) {
        formData.append("cv", values.cv);
      }

      // =================================================
      // CREATE
      // =================================================

      await createClient(formData);

      router.push("/admin/client");
    } catch (error) {
      console.error("Create client error:", error);

      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || t("messages.createFailed"),
        );

        return;
      }

      setServerError(t("messages.createFailed"));
    }
  };

  // =================================================
  // CANCEL
  // =================================================

  const handleCancel = () => {
    router.push("/admin/client");
  };

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
