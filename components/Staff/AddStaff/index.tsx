"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useStaffAddHook } from "./hook";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OutlinedInput from "@mui/material/OutlinedInput";
import { StaffAddFormValues, StaffAddPayload, staffAddSchema } from "./types";
import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";

export default function AddStaff() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { mutate, isPending } = useStaffAddHook();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffAddFormValues>({
    resolver: zodResolver(staffAddSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: StaffAddPayload) => {
    await mutate(data);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        selected="Staff"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="h-screen flex-1 overflow-y-auto px-8 pb-8">
        <Navbar title="Add Staff" />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Staff", href: "/staff" },
              { label: "Add Staff", current: true },
            ]}
          />
        </div>
      </main>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* name */}
        <Box>
          <Typography
            component="label"
            htmlFor="name"
            sx={{
              display: "block",
              mb: 0.75,
              fontSize: "14px",
              fontWeight: 600,
              color: "#333",
            }}
          >
            name
          </Typography>

          <OutlinedInput
            {...register("name")}
            id="name"
            type="name"
            fullWidth
            autoComplete="name"
            autoFocus
            placeholder="yamada@example.com"
            error={Boolean(errors.name)}
            aria-invalid={Boolean(errors.name)}
            sx={{
              height: "40px",
              backgroundColor: {
                xs: "#EDEDED",
                sm: "#fff",
              },
            }}
          />

          {errors.name?.message && (
            <Typography
              role="alert"
              sx={{
                mt: 0.5,
                fontSize: "12px",
                color: "error.main",
              }}
            >
              {errors.name.message}
            </Typography>
          )}
        </Box>

        {/* Location */}
        <Box>
          <Typography
            component="label"
            htmlFor="location"
            sx={{
              display: "block",
              mb: 0.75,
              fontSize: "14px",
              fontWeight: 600,
              color: "#333",
            }}
          >
            Location
          </Typography>

          <FormControl fullWidth error={Boolean(errors.location)}>
            <Select
              {...register("location")}
              id="location"
              defaultValue=""
              displayEmpty
              sx={{
                height: "40px",
                backgroundColor: {
                  xs: "#EDEDED",
                  sm: "#fff",
                },
              }}
            >
              <MenuItem value="" disabled>
                Select Location
              </MenuItem>

              <MenuItem value="Nepal">Nepal</MenuItem>
              <MenuItem value="Japan">Japan</MenuItem>
              <MenuItem value="USA">USA</MenuItem>
            </Select>
          </FormControl>

          {errors.location?.message && (
            <Typography
              role="alert"
              sx={{
                mt: 0.5,
                fontSize: "12px",
                color: "error.main",
              }}
            >
              {errors.location.message}
            </Typography>
          )}
        </Box>

        {/* Phone */}
        <Box>
          <Typography
            component="label"
            htmlFor="phone"
            sx={{
              display: "block",
              mb: 0.75,
              fontSize: "14px",
              fontWeight: 600,
              color: "#333",
            }}
          >
            Phone
          </Typography>
          <OutlinedInput
            {...register("phone")}
            id="phone"
            type="text"
            fullWidth
            autoComplete="phone"
            placeholder="123-456-7890"
            error={Boolean(errors.phone)}
            aria-invalid={Boolean(errors.phone)}
            sx={{
              height: "40px",
              backgroundColor: {
                xs: "#EDEDED",
                sm: "#fff",
              },
            }}
          />

          {errors.phone?.message && (
            <Typography
              role="alert"
              sx={{
                mt: 0.5,
                fontSize: "12px",
                color: "error.main",
              }}
            >
              {errors.phone.message}
            </Typography>
          )}
        </Box>

        {/* Email */}
        <Box>
          <Typography
            component="label"
            htmlFor="email"
            sx={{
              display: "block",
              mb: 0.75,
              fontSize: "14px",
              fontWeight: 600,
              color: "#333",
            }}
          >
            Email
          </Typography>

          <OutlinedInput
            {...register("email")}
            id="email"
            type="email"
            fullWidth
            autoComplete="email"
            placeholder="yamada@example.com"
            error={Boolean(errors.email)}
            aria-invalid={Boolean(errors.email)}
            sx={{
              height: "40px",
              backgroundColor: {
                xs: "#EDEDED",
                sm: "#fff",
              },
            }}
          />

          {errors.email?.message && (
            <Typography
              role="alert"
              sx={{
                mt: 0.5,
                fontSize: "12px",
                color: "error.main",
              }}
            >
              {errors.email.message}
            </Typography>
          )}
        </Box>
        {/* Password */}
        <Box>
          <Typography
            component="label"
            htmlFor="password"
            sx={{
              display: "block",
              mb: 0.75,
              fontSize: "14px",
              fontWeight: 600,
              color: "#333",
            }}
          >
            Password
          </Typography>
          <OutlinedInput
            {...register("password")}
            id="password"
            type="password"
            fullWidth
            autoComplete="current-password"
            placeholder="Password"
            error={Boolean(errors.password)}
            aria-invalid={Boolean(errors.password)}
            sx={{
              height: "40px",
              backgroundColor: {
                xs: "#EDEDED",
                sm: "#fff",
              },
            }}
          />
          {errors.password?.message && (
            <Typography
              role="alert"
              sx={{
                mt: 0.5,
                fontSize: "12px",
                color: "error.main",
              }}
            >
              {errors.password.message}
            </Typography>
          )}
        </Box>
        {/* Actions */}
        <Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isPending}
          >
            {"Save"}
          </Button>
        </Box>
      </Box>
    </div>
  );
}
