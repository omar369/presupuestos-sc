import { z } from 'zod';

// ESQUEMA DE SERVICIO 
export const serviceSchema = z.object({
  // El ID no se valida porque se genera en el frontend
  tipoServicio: z.enum(['PINTURA', 'ESMALTE', 'EPOXICO', 'SELLO', 'OTROS'], {
    message: 'El tipo de servicio es obligatorio.',
  }),
  unidadDeMedida: z.enum(['m2', 'ml'], {
    message: 'La unidad de medida es obligatoria.',
  }),
  cantidadM2: z
    .string({ message: 'Debe ser un número.' })
    .min(1, { message: 'La cantidad es obligatoria.' })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: 'Debe ser un número válido con hasta 2 decimales.',
    })
    .refine((val) => parseFloat(val) > 0, {
      message: 'La cantidad debe ser mayor a 0.',
    }),

  tipoSuperficie: z.enum(['LISO', 'RUGOSO', 'EXTRARUGOSO', 'SENCILLO', 'MEDIO', 'DIFICIL'], {
    message: 'El tipo de superficie es obligatorio.',
  }),
  marcaModelo: z
    .string()
    .min(1, 'La marca/modelo es obligatoria.')
    .regex(/^[a-zA-Z0-9 .,-]+$/, 'Solo se permiten letras, números, espacios, puntos, comas y guiones.'),
});

// Esquema para el FORMULARIO de creación de un área (simple)
export const areaFormSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre del área es obligatorio.')
    .regex(/^[a-zA-Z0-9 .,-]+$/, 'Solo se permiten letras, números, espacios, puntos, comas y guiones.'),
  location: z.enum(['INTERIOR', 'EXTERIOR'], {
    message: 'La ubicación es obligatoria.',
  }),
});

// Esquema para un área, que puede contener múltiples servicios
export const areaSchema = z.object({
  // El ID no se valida porque se genera en el frontend
  name: z
    .string()
    .min(1, 'El nombre del área es obligatorio.')
    .regex(/^[a-zA-Z0-9 .,-]+$/, 'Solo se permiten letras, números, espacios, puntos, comas y guiones.'),
  location: z.enum(['INTERIOR', 'EXTERIOR'], {
    message: 'La ubicación es obligatoria.',
  }),
  services: z.array(serviceSchema).min(1, "Debe haber al menos un servicio por área."),
});

// --- Esquemas para guardar en la BD (incluyen precios calculados) ---

const serviceWithPriceSchema = serviceSchema.extend({
  precioUnitario: z.number(),
  importe: z.number(),
});

const areaWithPriceSchema = areaSchema.extend({
  services: z.array(serviceWithPriceSchema).min(1, "Debe haber al menos un servicio por área."),
});

// --- Esquemas para el formulario de presupuesto y guardado final ---

// Esquema para los datos iniciales del presupuesto
export const budgetSchema = z.object({
  cliente: z
    .string()
    .min(1, 'El nombre del cliente es obligatorio.')
    .regex(/^[a-zA-Z0-9 .,-]+$/, 'Solo se permiten letras, números, espacios, puntos, comas y guiones.'),
  direccion: z
    .string()
    .min(1, 'La dirección es obligatoria.')
    .regex(/^[a-zA-Z0-9 .,-]+$/, 'Solo se permiten letras, números, espacios, puntos, comas y guiones.'),
  tipoLugar: z.enum(
    ['CASA', 'DEPARTAMENTO', 'BODEGA', 'LOCAL', 'OFICINA', 'OTROS'],
    {
      message: 'El tipo de lugar es obligatorio.',
    }
  ),
});

// Esquema completo para la cotización que se guarda en la BD
export const quoteSchema = budgetSchema.extend({
  areas: z.array(areaWithPriceSchema).min(1, "Debe haber al menos un área en el presupuesto."),
  subtotal: z.number(),
  impuestos: z.number(),
  total: z.number(),
});
