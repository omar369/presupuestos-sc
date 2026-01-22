import { z } from 'zod'

export const serviceTypeSchema = z.enum(['PINTURA', 'ESMALTE', 'SELLO', 'EPOXICO', 'OTROS'])
export const unitSchema = z.enum(['M2', 'ML'])
export const stateSchema = z.enum(['SIN_COMENZAR', 'EN_PROCESO', 'TERMINADO'])

export const ddmmaaSchema = z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{2}$/, 'Formato dd/mm/aa')
    .optional()

export const serviceSchema = z.object({
    tipoServicio: serviceTypeSchema,
    unidad: unitSchema,
    cantidad: z.number().min(0),
    acabadoId: z.string().optional(),
    fechaEntrega: ddmmaaSchema,
    porcentaje: z.number().min(0).max(100),
    estado: stateSchema,
}).superRefine((v, ctx) => {
    // estado coherente con porcentaje (puedes hacerlo auto en UI también)
    if (v.porcentaje === 0 && v.estado !== 'SIN_COMENZAR')
        ctx.addIssue({ code: 'custom', path: ['estado'], message: 'Con 0% debe ser SIN_COMENZAR' })
    if (v.porcentaje === 100 && v.estado !== 'TERMINADO')
        ctx.addIssue({ code: 'custom', path: ['estado'], message: 'Con 100% debe ser TERMINADO' })
})

export type ServiceForm = z.infer<typeof serviceSchema>
