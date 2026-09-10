"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useStaffAddHook } from "./hook";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { StaffAddFormValues, staffAddSchema, STAFF_LOCATIONS } from "./types";

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

  const onSubmit = async (data: StaffAddFormValues) => {
    mutate(data);
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

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: "600px",
          }}
        >
          {/* Name */}
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
              Name
            </Typography>

            <OutlinedInput
              {...register("name")}
              id="name"
              type="text"
              fullWidth
              autoComplete="name"
              autoFocus
              placeholder="Enter staff name"
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
              type="tel"
              fullWidth
              autoComplete="tel"
              placeholder="Enter phone number"
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

          <Select
            {...register("location")}
            id="location"
            fullWidth
            defaultValue=""
            displayEmpty
            error={Boolean(errors.location)}
            aria-invalid={Boolean(errors.location)}
            sx={{
              height: "40px",
              backgroundColor: {
                xs: "#EDEDED",
                sm: "#fff",
              },
            }}
          >
            <MenuItem value="" disabled>
              Select location
            </MenuItem>
            {STAFF_LOCATIONS.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </Select>

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
              autoComplete="new-password"
              placeholder="Enter password"
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
              sx={{
                mt: 1,
                mb: 2,
                height: "45px",
              }}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
        </Box>
        </Box>
      </main>
   
    </div>
  );
}