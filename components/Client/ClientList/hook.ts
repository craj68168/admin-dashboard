import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useClientListHook = () => {
  const { data } = useQuery({
    queryKey: ["client-list"],
    queryFn: async () => {
      return api.get("/clients/clients").then((res) => res.data);
    },
  });
  return { data };
};
