# CoreDash — Admin Dashboard

**CoreDash** es un panel de administración SPA moderno construido con Angular 22, diseñado con arquitectura zoneless, componentes standalone y estado reactivo basado en Signals.

## Stack técnico

| Tecnología | Versión |
|---|---|
| Angular | 22 (standalone, zoneless) |
| PrimeNG | 21 (tema Aura) |
| TailwindCSS | 4 |
| Chart.js | 4 |
| TypeScript | 6 |

## Características

- **Login** con Signal Forms, validación y AuthGuard
- **Dashboard** con 4 tarjetas KPI, gráfico de líneas (ventas mensuales), gráfico de dona (categorías) y tabla de transacciones recientes
- **Usuarios** — tabla paginada con búsqueda y filtros por rol/estado, modal para crear/editar, diálogo de confirmación para eliminar
- **Productos** — tabla con imagen, badge de stock bajo, filtro por categoría, modal CRUD
- **Página 404** personalizada
- **Layout responsive** — sidebar colapsable en móvil, topbar con avatar y logout
- **Lazy loading** por feature module
- **Estado reactivo** con Angular Signals (sin NgRx)
- **Datos mock** consumidos desde `db.json` mediante `httpResource`

## Credenciales de acceso

```
Email:    admin@core.com
Password: admin123
```

## Requisitos

- Node.js 24+
- npm 11+

## Instalación

```bash
git clone https://github.com/tu-usuario/core-dash.git
cd core-dash
npm install
```

## Servidor de desarrollo

```bash
ng serve
```

Navega a `http://localhost:4200/`. La aplicación se recarga automáticamente al modificar archivos.

## Build de producción

```bash
ng build
```

Los artefactos se generan en `dist/core-dash`.

## Deploy a GitHub Pages

```bash
# Opción 1: usando angular-cli-ghpages
npm install -D angular-cli-ghpages
ng build --base-href "/core-dash/" --output-path dist/core-dash/browser
npx angular-cli-ghpages --dir=dist/core-dash/browser

# Opción 2: manual (copia 404.html para SPA fallback)
ng build --base-href "/core-dash/" --output-path docs/browser
cp docs/browser/index.html docs/browser/404.html
# Configurar GitHub Pages → branch main, carpeta /docs
```

## Estructura del proyecto

```
src/
├── main.ts
├── index.html
├── styles.css
├── public/db.json                    # Datos mock
└── app/
    ├── app.config.ts                 # Providers globales
    ├── app.routes.ts                 # Rutas con lazy loading
    ├── guards/auth.guard.ts          # Protección de rutas
    ├── shared/
    │   ├── services/auth.service.ts  # Autenticación con Signals
    │   ├── models/                   # Interfaces compartidas
    │   ├── components/
    │   │   ├── sidebar/              # Navegación lateral
    │   │   └── topbar/               # Barra superior
    │   └── layout/                   # Layout principal
    └── features/
        ├── auth/login/               # Página de login
        ├── dashboard/                # Dashboard con KPIs y gráficos
        ├── users/                    # CRUD de usuarios
        ├── products/                 # CRUD de productos
        └── not-found/                # Página 404
```
