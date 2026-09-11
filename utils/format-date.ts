import dayjs from "dayjs";

export function formatCreatedAt(value?: string | Date | null): string {
  return value ? dayjs(value).format("YYYY/MM/DD mm:ss") : "N/A";
}
