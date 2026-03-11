export interface PaginatedResponse<T> {
  total: number
  results: T[]
}

export interface HorariosResponse<T> {
  total: number
  skip: number
  limit: number
  stale: boolean
  results: T[]
}

export interface Calendario {
  id: number
  name: string
  siiau_id: string
}

export interface Centro {
  id: number
  name: string
  siiau_id: string
  edificios: Edificio[]
}

export interface Edificio {
  id: number
  name: string
  centro_id: number
  aulas?: Aula[]
  centro?: Omit<Centro, 'edificios'>
}

export interface Aula {
  id: number
  name: string
  edificio_id: number
  edificio?: Omit<Edificio, 'aulas' | 'centro'>
}

export interface Materia {
  siiapi_id: number
  name: string
  clave: string
  creditos: number
}

export interface Profesor {
  siiapi_id: number
  name: string
}

export interface SeccionCalendario {
  siiapi_id: number
  name: string
  siiau_id: string
}

export interface SeccionCentro {
  siiapi_id: number
  name: string
  siiau_id: string
}

export interface Seccion {
  siiapi_id: number
  name: string
  nrc: string
  cupos: number
  cupos_disponibles: number
  periodo_inicio: string
  periodo_fin: string
  materia: Materia
  profesor: Profesor
  centro: SeccionCentro
  calendario: SeccionCalendario
}

export interface AulaHorario {
  siiapi_id: number
  name: string
  edificio: {
    siiapi_id: number
    name: string
    centro: {
      siiapi_id: number
      name: string
      siiau_id: string
    }
  }
}

export interface Horario {
  _id: string
  siiapi_id: number
  aula: AulaHorario
  aula_id: number
  cached_at: string
  calendario_id: number
  centro_id: number
  dia: number // 1=Lunes ... 6=Sábado
  edificio_id: number
  hora_fin: string   // "HH:MM:SS"
  hora_inicio: string // "HH:MM:SS"
  seccion: Seccion
  seccion_id: number
  sesion: number
}

export const DIAS = [
  { id: 1, name: 'Lunes' },
  { id: 2, name: 'Martes' },
  { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' },
  { id: 5, name: 'Viernes' },
  { id: 6, name: 'Sábado' },
] as const
