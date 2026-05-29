# Documentación del Proyecto: EventaCanvas (InvitacionesDinámicas)

## Resumen Ejecutivo
EventaCanvas es una aplicación web diseñada para la creación interactiva de invitaciones dinámicas exportables a formato PDF. La plataforma permite a los usuarios diseñar invitaciones elegantes y personalizadas mediante un editor de lienzo (canvas), con soporte multiidioma y un estilo de diseño predefinido ("Alexandria High-End Editorial").

## Stack Tecnológico Principal

### Frontend & Framework
* **Framework:** Next.js 16.2.6 (App Router)
* **Librería UI:** React 19.2.4
* **Lenguaje:** TypeScript 5
* **Estilos:** Tailwind CSS 4.3.0 / PostCSS
* **Fuentes:** Noto Serif y Public Sans (vía @fontsource)

### Backend & Autenticación
* **BaaS (Backend as a Service):** Supabase (@supabase/supabase-js 2.106.2)
* **Autenticación:** Google Workspace (GSuite) login gestionado vía Supabase, con política de sesión única activa por usuario (las sesiones anteriores se invalidan tras un nuevo inicio de sesión).

### Herramientas del Editor de Invitaciones
* **Motor del Canvas:** Fabric.js 5.3.0
* **Generación de PDFs:** jsPDF 4.2.1
* **Iconografía:** Lucide React 1.17.0

## Arquitectura de Carpetas (`src/`)

El código fuente principal reside en la carpeta `src`, estructurado bajo el paradigma de Next.js App Router:

```text
src/
├── app/                  # Rutas de la aplicación (App Router)
│   ├── editor/           # Rutas relacionadas al editor interactivo
│   │   └── [id]/         # Ruta dinámica para editar una invitación específica (page.tsx)
│   ├── login/            # Pantalla de inicio de sesión (page.tsx)
│   ├── favicon.ico       # Icono del sitio
│   ├── globals.css       # Estilos globales y configuración de Tailwind
│   ├── layout.tsx        # Layout principal de la aplicación
│   └── page.tsx          # Landing page o dashboard principal
├── components/           # Componentes reutilizables de React
│   ├── AuthProvider.tsx  # Proveedor de contexto para autenticación (Supabase)
│   ├── CanvasEditor.tsx  # Componente principal interactivo del editor (Fabric.js)
│   ├── EditorSkeleton.tsx# Skeleton loader para estados de carga del editor
│   ├── LanguageSwitcher.tsx # Selector de idioma
│   ├── Sidebar.tsx       # Barra lateral de navegación o herramientas
│   └── TopAppBar.tsx     # Barra de navegación superior
├── data/                 # Datos estáticos o mock data
│   └── templates.ts      # Plantillas predefinidas de invitaciones
├── i18n/                 # Internacionalización (soporte para 5 idiomas)
│   ├── I18nProvider.tsx  # Context provider para idiomas
│   └── dictionaries.ts   # Diccionarios de traducciones
└── lib/                  # Librerías, utilidades y clientes configurados
    └── supabase.ts       # Configuración y cliente de conexión a Supabase
```

## Características Clave del Flujo

1. **Autenticación:** El flujo se protege mediante `AuthProvider.tsx`. Los usuarios no autenticados son redirigidos a `/login`.
2. **Editor Canvas (`/editor/[id]`):** El núcleo de la aplicación utiliza `CanvasEditor.tsx`, donde a través de Fabric.js el usuario puede mover, editar y personalizar elementos gráficos y de texto predefinidos en `templates.ts`.
3. **Internacionalización:** Toda la interfaz es soportada por un sistema de diccionarios en `src/i18n`, manejando hasta 5 idiomas a través de `LanguageSwitcher.tsx`.
4. **Exportación:** Los diseños resultantes en el canvas son procesados con jsPDF, respetando las resoluciones y enlaces clicables (si existen), para exportarlos a un PDF final que el cliente descargará.

## Comandos de Desarrollo y Verificación
La aplicación utiliza `pnpm` como gestor de paquetes principal.

* **Iniciar servidor local:** `pnpm dev`
* **Compilar para producción:** `pnpm build`
* **Iniciar en producción:** `pnpm start`
* **Ejecutar linternado:** `pnpm lint`

## Consideraciones de Flujo de Trabajo (Repositorio)
* Se debe trabajar siempre en ramas (branches) remotas por cada nueva funcionalidad (`feature/*`, `fix/*`, etc.).
* **Rama intermedia:** `developed` se utiliza como entorno de integración principal antes de producción.
* La rama principal (default) y de destino para unificar el código final en producción es **`main`**.
* El flujo hacia `main` y despliegues está completamente automatizado (CI/CD), minimizando los pasos manuales.

## Integración y Despliegue Continuo (CI/CD)
* Las ramas de funcionalidad (`feature/*`, `fix/*`, etc.) se trabajan en base a un flujo estructurado.
* La integración a la rama `main` se encuentra **automatizada**. Todos los pull requests y aprobaciones que pasen las validaciones automáticas se fusionarán directamente a producción sin requerir intervención manual constante.
