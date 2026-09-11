"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Breadcrumb from "@/components/Breadcrumb";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useEditStaffHook } from "./hook";
import {
  STAFF_LOCATIONS,
  staffEditSchema,
  type StaffEditFormValues,
} from "./types";

const defaultValues: StaffEditFormValues = {
  name: "",
  phone: "",
  location: "",
  email: "",
  password: "",
};

export default function EditStaff() {
  const { staff, isLoading, isError, errorMessage, updateStaff } =
    useEditStaffHook();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffEditFormValues>({
    resolver: zodResolver(staffEditSchema),
    defaultValues,
  });

  useEffect(() => {
    if (staff) {
      reset({
        name: staff.name ?? "",
        phone: staff.phone ?? "",
        location: staff.location ?? "",
        email: staff.email ?? "",
        password: "",
      });
    }
  }, [reset, staff]);

  const onSubmit = (values: StaffEditFormValues) => {
    updateStaff.mutate(values);
  };

  if (isLoading) {
    return <StatusMessage message="Loading staff details..." />;
  }

  if (isError || !staff) {
    return (
      <StatusMessage
        message={errorMessage || "Staff member could not be found."}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Staff", href: "/admin/staff" },
              { label: "Edit Staff", current: true },
            ]}
          />
        </div>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            width: "calc(100% - 20px)",
            m: "10px",
            p: { xs: 2.5, sm: 4 },
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            backgroundColor: "#fff",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Typography
            component="h1"
            sx={{
              mb: 0.75,
              fontSize: { xs: "1.35rem", sm: "1.5rem" },
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Edit staff member
          </Typography>

          <Typography sx={{ mb: 3, fontSize: "14px", color: "#64748b" }}>
            Update the staff member&apos;s account details. Leave the password
            blank to keep the current password.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: { xs: 2, sm: 2.5 },
            }}
          >
            <FormInput
              id="name"
              label="Name"
              register={register("name")}
              error={errors.name?.message}
              placeholder="Enter staff name"
              autoFocus
            />
            <FormInput
              id="phone"
              label="Phone"
              type="tel"
              register={register("phone")}
              error={errors.phone?.message}
              placeholder="Enter phone number"
            />
            <FormInput
              id="email"
              label="Email"
              type="email"
              register={register("email")}
              error={errors.email?.message}
              placeholder="yamada@example.com"
            />

            <Box>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Select
                {...register("location")}
                id="location"
                fullWidth
                displayEmpty
                error={Boolean(errors.location)}
                defaultValue=""
                sx={{ height: "40px" }}
              >
                <MenuItem value="" disabled>
                  Select location
                </MenuItem>
                {STAFF_LOCATIONS.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
              <ErrorMessage message={errors.location?.message} />
            </Box>

            <FormInput
              id="password"
              label="New password"
              type="password"
              register={register("password")}
              error={errors.password?.message}
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gridColumn: { xs: "auto", md: "1 / -1" },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={updateStaff.isPending}
                sx={{ mt: 1, height: "45px" }}
              >
                {updateStaff.isPending ? "Saving..." : "Save changes"}
              </Button>
            </Box>
          </Box>

          {updateStaff.isError && (
            <Typography role="alert" sx={{ mt: 2, color: "error.main" }}>
              {getErrorMessage(updateStaff.error)}
            </Typography>
          )}
        </Box>
      </main>
    </div>
  );
}

type FormInputProps = {
  id: keyof StaffEditFormValues;
  label: string;
  type?: "text" | "tel" | "email" | "password";
  register: ReturnType<
    ReturnType<typeof useForm<StaffEditFormValues>>["register"]
  >;
  error?: string;
  placeholder: string;
  autoFocus?: boolean;
  autoComplete?: string;
};

function FormInput({
  id,
  label,
  type = "text",
  register,
  error,
  placeholder,
  autoFocus,
  autoComplete,
}: FormInputProps) {
  return (
    <Box>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <OutlinedInput
        {...register}
        id={id}
        type={type}
        fullWidth
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        placeholder={placeholder}
        error={Boolean(error)}
        aria-invalid={Boolean(error)}
        sx={{ height: "40px" }}
      />
      <ErrorMessage message={error} />
    </Box>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      sx={{
        display: "block",
        mb: 0.75,
        fontSize: "14px",
        fontWeight: 600,
        color: "#333",
      }}
    >
      {children}
    </Typography>
  );
}

function ErrorMessage({ message }: { message?: string }) {
  return message ? (
    <Typography
      role="alert"
      sx={{ mt: 0.5, fontSize: "12px", color: "error.main" }}
    >
      {message}
    </Typography>
  ) : null;
}

function StatusMessage({ message }: { message: string }) {
  return <Box sx={{ p: 4, color: "#64748b" }}>{message}</Box>;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Unable to update staff member.";
}
