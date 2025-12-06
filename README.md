# App Presupuestos (cotizaciones-sc)

## Resumen
Esta es una aplicación web construida con Next.js para la generación de presupuestos de servicios de pintura. Permite a los usuarios crear cotizaciones detalladas, calculando costos basados en áreas, tipos de superficie y servicios específicos. La aplicación utiliza un sistema de claves internas para estandarizar los precios y guarda los presupuestos en una base de datos.

## Tecnologías Principales
- **Framework:** Next.js (App Router)
- **UI:** React, TypeScript, Shadcn UI, Tailwind CSS
- **ORM:** Drizzle ORM con Turso (SQLite) **Validación:** Zod **Estilo de Código:** ESLint, Prettier ## Organización del Proyecto
La estructura del proyecto está organizada para separar claramente las responsabilidades:

- `app/`: Contiene las rutas y la UI principal de la aplicación.
  - `app/api/`: Endpoints del backend para la lógica de negocio.
    - `calcula-presupuesto/`: Calcula el costo del presupuesto.
    - `presupuestos/`: Guarda el presupuesto en la base de datos.
  - `app/presupuestos/nuevo/`: Página principal para la creación de un nuevo presupuesto.
- `components/`: Componentes reutilizables de React.
  - `presupuestos/`: Componentes de formulario específicos para la creación de presupuestos (`QuoteForm`, `AreaForm`, `ServiceForm`).
  - `ui/`: Componentes genéricos de Shadcn UI.
- `lib/`: Lógica y utilidades compartidas.
  - `lista_precios_servicio.ts`: Contiene la lista de precios mapeada a claves internas.
  - `validations.ts`: Define los esquemas de validación con Zod para los formularios.
- `db/`: Configuración de la base de datos y esquema.
  - `schema.ts`: Define la estructura de la base de datos con Drizzle ORM.
- `nomenclatura.txt`: Documentación sobre cómo se generan las "claves internas" para cada tipo de servicio.

## Características Principales
1.  **Creación de Presupuestos:** La funcionalidad central es un formulario de varios pasos que permite a los usuarios introducir los datos del cliente, definir múltiples áreas (interiores/exteriores) y agregar servicios específicos a cada una (ej. pintura lisa, rugosa).
2.  **Sistema de Claves Internas:** Para estandarizar los precios, la aplicación genera una "clave interna" única para cada combinación de servicio (ej. `PIN-LISO-INT-VINIMEX-TOTAL`). Esta clave se usa para buscar el precio por m² en una lista de precios predefinida.
3.  **Lista de Precios Centralizada:** El archivo `lib/lista_precios_servicio.ts` actúa como una base de datos en memoria para los precios, facilitando la actualización y el mantenimiento de los costos.
4.  **Análisis de Costos:** El backend calcula el costo total del presupuesto basado en los metros cuadrados y los servicios seleccionados, aplicando la lógica de precios de la lista.
5.  **Persistencia de Datos:** Las cotizaciones generadas se guardan en una base de datos Turso, permitiendo un futuro historial y gestión de presupuestos.

## Desarrollo Futuro (Pendientes)
- **Mejorar la Experiencia de Usuario (UX):**
  - Agregar un icono de información (`<Info>`) junto a los campos del formulario que lo requieran. Al hacer clic, se mostrará un pequeño snippet o tooltip (usando un componente de Shadcn como `Popover` o `Tooltip`) para explicar qué dato se necesita.
- **Convertir en Progressive Web App (PWA):**
  - Implementar las capacidades de una PWA para mejorar la funcionalidad en dispositivos móviles.
  - **Acceso a Cámara:** Permitir a los usuarios usar la cámara del dispositivo para tomar fotos de las áreas a pintar y adjuntarlas al presupuesto.
  - **Guardado Local:** Habilitar la opción de guardar el presupuesto generado como un archivo PDF directamente en el sistema de archivos local del dispositivo.
  - **Integración con WhatsApp:** Añadir una función para compartir el presupuesto (ya sea un resumen o el PDF) directamente a través de WhatsApp.
