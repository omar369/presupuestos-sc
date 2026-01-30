import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'

// Configurar Cloudinary con variables de entorno
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const okTypes = ['image/png', 'image/jpeg', 'image/svg+xml']
    if (!okTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Tipo no permitido' }, { status: 400 })
    }

    try {
        // Convertir el archivo a buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Subir a Cloudinary usando upload_stream
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'croquis-backgrounds', // Organizar en carpeta
                    resource_type: 'auto', // Detecta automáticamente el tipo (image, raw para SVG)
                    public_id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, // Nombre único
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            uploadStream.end(buffer)
        })

        // Retornar la URL pública de Cloudinary
        return NextResponse.json({
            url: uploadResult.secure_url,
            mime: file.type
        })

    } catch (error) {
        console.error('Error uploading to Cloudinary:', error)
        return NextResponse.json({
            error: 'Error al subir archivo a Cloudinary'
        }, { status: 500 })
    }
}
