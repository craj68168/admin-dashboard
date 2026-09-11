"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

export default function NoDataOverlay() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 150,
        gap: 1,
        px: 2,
        textAlign: "center",
      }}
    >
      <Image
        src="/company_logo.png"
        alt="Fortune Link"
        width={112}
        height={112}
        unoptimized
        style={{ objectFit: "contain", opacity: 0.7, display: "block" }}
      />
      <Typography sx={{ color: "#475569", fontSize: "14px", fontWeight: 600 }}>
        No data found
      </Typography>
      <Typography sx={{ color: "#94A3B8", fontSize: "12px" }}>
        There are no records to display yet.
      </Typography>
    </Box>
  );
}
