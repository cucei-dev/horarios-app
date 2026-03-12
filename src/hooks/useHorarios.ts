import { useQuery } from "@tanstack/react-query";
import { fetchAllHorarios } from "../api/horariosApi";
import type { Horario } from "../types";

interface UseHorariosParams {
  calendario_id: number | null;
  edificio_id: number | null;
  dia?: number | null;
  aula_id?: number | null;
}

export function useHorarios({
  calendario_id,
  edificio_id,
  dia,
  aula_id,
}: UseHorariosParams) {
  const isEnabled = !!(calendario_id && edificio_id);

  return useQuery<Horario[]>({
    queryKey: ["horarios", calendario_id, edificio_id, dia, aula_id],
    queryFn: async () => {
      if (!calendario_id || !edificio_id) {
        return [];
      }
      const horarios = await fetchAllHorarios({
        calendario_id,
        edificio_id,
        dia: dia ?? undefined,
        aula_id: aula_id ?? undefined,
      });
      return horarios;
    },
    enabled: isEnabled,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    placeholderData: (previousData) => previousData,
  });
}
