"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type { AddStageModalProps } from "../type";

// =================================================
// DESIGN
// =================================================

const BRAND = "#107A64";
const BRAND_DARK = "#0C5F4F";
const BORDER = "rgba(17, 24, 39, 0.10)";
const INK = "#111827";
const MUTED = "#6B7280";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,

    "& fieldset": {
      borderColor: BORDER,
    },

    "&:hover fieldset": {
      borderColor: "rgba(16,122,100,0.4)",
    },

    "&.Mui-focused fieldset": {
      borderColor: BRAND,
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND,
  },

  "& .MuiFormHelperText-root": {
    mx: 0.5,
    mt: 0.5,
    fontSize: 11.5,
  },
};

// =================================================
// COMPONENT
// =================================================

const AddStageModal = ({
  open,
  values,
  errors,
  submitError,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: AddStageModalProps) => {
  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
        }}
      >
        <Typography
          component="div"
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: INK,
          }}
        >
          Add Client Stage
        </Typography>

        <Typography
          component="div"
          sx={{
            mt: 0.5,
            fontSize: 12.5,
            lineHeight: 1.5,
            color: MUTED,
          }}
        >
          Create a new Stage Master entry. The new stage will immediately become
          available in the Next stage list.
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: "16px !important",
        }}
      >
        {submitError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            {submitError}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            autoFocus
            required
            fullWidth
            size="small"
            label="Stage name"
            placeholder="Example: Interview Preparation"
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            disabled={isSubmitting}
            sx={fieldSx}
          />

          <TextField
            required
            fullWidth
            size="small"
            type="number"
            label="Stage amount"
            value={values.amount}
            onChange={(event) => onChange("amount", event.target.value)}
            error={Boolean(errors.amount)}
            helperText={
              errors.amount || "Enter 0 if this stage does not require payment."
            }
            disabled={isSubmitting}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
              },

              input: {
                startAdornment: (
                  <InputAdornment position="start">¥</InputAdornment>
                ),
              },
            }}
            sx={fieldSx}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 1.5,
        }}
      >
        <Button
          type="button"
          startIcon={<CloseRoundedIcon />}
          disabled={isSubmitting}
          onClick={handleClose}
          sx={{
            color: MUTED,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="contained"
          disableElevation
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <AddRoundedIcon />
            )
          }
          onClick={onSubmit}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            bgcolor: BRAND,
            fontWeight: 700,
            textTransform: "none",

            "&:hover": {
              bgcolor: BRAND_DARK,
            },
          }}
        >
          {isSubmitting ? "Adding..." : "Add Stage"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStageModal;
