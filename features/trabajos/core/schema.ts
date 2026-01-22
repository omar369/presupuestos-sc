import { z } from 'zod'

export const trabajoStatusSchema = z.enum(['BORRADOR', 'ACTIVO', 'CERRADO'])

export const trabajoCreateSchema = z.object({
    titulo: z.string().min(2),
    descripcion: z.string().optional(),

    clienteNombre: z.string().optional(),
    encargadoNombre: z.string().optional(),

    direccion: z.string().optional(),
    contacto: z.string().optional(),

    status: trabajoStatusSchema.default('BORRADOR'),
})

export type TrabajoCreateInput = z.input<typeof trabajoCreateSchema>
