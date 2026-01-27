'use client'
import { useRouter } from 'next/navigation'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trabajoCreateSchema, type TrabajoCreateInput } from '@/features/trabajos/core/schema'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAlert } from '@/lib/use-alert'

export default function TrabajoForm() {
    const router = useRouter()
    const { showAlert, AlertComponent } = useAlert()
    const { register, handleSubmit } = useForm<TrabajoCreateInput>({
        resolver: zodResolver(trabajoCreateSchema),
        defaultValues: { status: 'BORRADOR' },
    })

    const onSubmit: SubmitHandler<TrabajoCreateInput> = async (values) => {
        const res = await fetch('/api/trabajos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
        if (!res.ok) {
            showAlert('Error', 'No se pudo guardar el trabajo')
            return
        }

        const { data } = await res.json()
        router.push(`/herramientas/trabajos/${data.id}`)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                <div>
                    <div className="text-xs opacity-80 mb-1">Título</div>
                    <Input {...register('titulo')} />
                </div>

                <div>
                    <div className="text-xs opacity-80 mb-1">Descripción</div>
                    <Textarea {...register('descripcion')} rows={3} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <div className="text-xs opacity-80 mb-1">Cliente</div>
                        <Input {...register('clienteNombre')} />
                    </div>
                    <div>
                        <div className="text-xs opacity-80 mb-1">Encargado</div>
                        <Input {...register('encargadoNombre')} />
                    </div>
                </div>

                <div>
                    <div className="text-xs opacity-80 mb-1">Dirección</div>
                    <Input {...register('direccion')} />
                </div>

                <div>
                    <div className="text-xs opacity-80 mb-1">Contacto</div>
                    <Input {...register('contacto')} />
                </div>

                <Button type="submit">Guardar trabajo</Button>
            </form>
            {AlertComponent}
        </>
    )
}
