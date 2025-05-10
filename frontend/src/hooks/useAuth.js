import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export const useAuth = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}; 