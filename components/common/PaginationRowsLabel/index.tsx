import Typography from "@mui/material/Typography";

type PaginationRowsLabelProps = {
  count: number;
  from: number | null;
  to: number | null;
  itemLabel?: string;
};

export default function PaginationRowsLabel({
  count,
  from,
  to,
  itemLabel = "clients",
}: PaginationRowsLabelProps) {
  if (count === 0 || from === null || to === null) {
    return (
      <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
        No {itemLabel} found
      </Typography>
    );
  }

  return (
    <Typography variant="body2" sx={{ color: "#4B5563", fontWeight: 500 }}>
      Showing {from.toLocaleString()} to {to.toLocaleString()} of {count.toLocaleString()} {itemLabel}
    </Typography>
  );
}
