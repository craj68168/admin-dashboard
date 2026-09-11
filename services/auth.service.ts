import { api } from "@/lib/axios";

export const getProfile = async () => {
  try {
    const response = await api.get("/me");
    return response.data ?? null;
  } catch (error) {
    console.warn(
      "Profile endpoint is unavailable yet; continuing with login state.",
      error,
    );
    return null;
  }
};
