import { useQuery } from "@tanstack/react-query";
import { fetchCentros } from "../api/siiapi";
import type { Centro } from "../types";

export function useCentros() {
  return useQuery<Centro[]>({
    queryKey: ["centros"],
    queryFn: fetchCentros,
    staleTime: 1000 * 60 * 5,
  });
}
