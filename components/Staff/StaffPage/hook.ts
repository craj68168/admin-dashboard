import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

export const useStaffHook = ()=>{
    const {isLoading,data} = useQuery({
        queryKey:['staffList'],
        queryFn: async ()=>{
            return api.get("/staff")
        }
    })
    return { isLoading,staffData:data}
}
