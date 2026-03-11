import type { PaginatedResponse, Calendario, Centro, Edificio, Aula } from '../types'

const BASE = import.meta.env.VITE_SIIAPI_URL as string

async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${BASE}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
  return res.json()
}

export async function fetchCalendarios(): Promise<Calendario[]> {
  const data = await get<PaginatedResponse<Calendario>>('/calendarios/', { limit: 100 })
  return data.results
}

export async function fetchCentros(): Promise<Centro[]> {
  const data = await get<PaginatedResponse<Centro>>('/centros/', { limit: 100 })
  return data.results
}

export async function fetchEdificio(id: number): Promise<Edificio> {
  const data = await get<PaginatedResponse<Edificio>>('/edificios/', { limit: 1, centro_id: id })
  return data.results[0]
}

export async function fetchAulas(edificio_id: number): Promise<Aula[]> {
  const data = await get<PaginatedResponse<Aula>>('/aulas/', { edificio_id, limit: 100 })
  return data.results
}
