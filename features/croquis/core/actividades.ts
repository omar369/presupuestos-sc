export const ACTIVIDADES = [
    'REVISION DE SITIO',
    'LIMPIEZA Y PREPARACION',
    'REPARACION DE FALLAS',
    'APLICACION DE PRIMARIO',
    'DETALLES CRITICOS',
    'APLICACION DE PRIMERA MANO',
    'APLICACION DE SEGUNDA MANO',
    'REVISION Y CORRECCION',
    'LIMPIEZA Y ENTREGA',
    'OTRO',
] as const

export type Actividad = (typeof ACTIVIDADES)[number]

export const SERVICE_COLORS: Record<string, string> = {
    PINTURA: '#60a5fa',
    ESMALTE: '#34d399',
    SELLO: '#f97316',
    EPOXICO: '#a78bfa',
    OTROS: '#9ca3af',
}