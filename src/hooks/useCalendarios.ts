import { useQuery } from "@tanstack/react-query";
import { fetchCalendarios } from "../api/siiapi";
import type { Calendario } from "../types";

export function useCalendarios() {
  return useQuery<Calendario[]>({
    queryKey: ["calendarios"],
    queryFn: fetchCalendarios,
    staleTime: 1000 * 60 * 5,
  });
}
