# Magnolia Joyas — Full Stack E-commerce

Tienda de joyas online desarrollada con Next.js (frontend) y NestJS (backend). Incluye autenticación con verificación por email, 2FA para administradores, carrito de compras persistente, integración con Mercado Pago, subida de imágenes a Cloudinary y panel de administración completo.

---

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Backend — NestJS](#backend--nestjs)
  - [Módulos](#módulos)
  - [Base de datos y entidades](#base-de-datos-y-entidades)
  - [Endpoints de la API](#endpoints-de-la-api)
  - [Seguridad](#seguridad)
  - [Integraciones externas](#integraciones-externas)
- [Frontend — Next.js](#frontend--nextjs)
  - [Páginas y rutas](#páginas-y-rutas)
  - [Componentes principales](#componentes-principales)
  - [Estado global (Contexts)](#estado-global-contexts)
  - [Hooks personalizados](#hooks-personalizados)
  - [Flujo de pagos](#flujo-de-pagos)
- [Flujos principales](#flujos-principales)
- [Deploy](#deploy)

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Estilos | Tailwind CSS v4, Framer Motion |
| Íconos | Lucide React, Heroicons |
| Estado global | React Context API |
| Fetching | SWR, fetch nativo |
| Backend | NestJS 11, TypeScript |
| Base de datos | PostgreSQL + TypeORM |
| Autenticación | JWT (30 días) + bcrypt |
| Email | Nodemailer (Gmail SMTP) |
| Imágenes | Cloudinary |
| Pagos | Mercado Pago SDK v2 |
| Notificaciones UI | react-hot-toast |
| Gráficos admin | Recharts |

---

## Estructura del proyecto

```
magnolia-joyas-full/
├── Back/                   # API REST — NestJS (puerto 4000)
│   ├── src/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── decorators/
│   │   ├── image-upload/
│   │   ├── mail/
│   │   ├── mercado-pago/
│   │   ├── migrations/
│   │   ├── order/
│   │   ├── product-ratings/
│   │   ├── products/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── Front/                  # App web — Next.js (puerto 3000)
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── context/
    │   ├── lib/
    │   ├── services/
    │   ├── types/
    │   └── data/
    └── package.json
```

---

## Variables de entorno

### Backend — `Back/.env`

```env
# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=magnolia_data
NODE_ENV=development
PORT=4000

# JWT
JWT_SECRET=tu_clave_secreta

# CORS (separar por comas si son múltiples orígenes)
CORS_ORIGIN=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Mercado Pago
MP_ACCESS_TOKEN=
MP_BASE_URL=https://tu-dominio.com
MP_SUCCESS_URL=/checkout/success
MP_FAILURE_URL=/checkout/failure
MP_NOTIFICATION_URL=https://tu-dominio.com/mercado-pago/webhook

# Email (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_email@gmail.com
MAIL_PASSWORD=tu_app_password_gmail
MAIL_FROM=tu_email@gmail.com
```

### Frontend — `Front/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_MP_PUBLIC_KEY=tu_public_key_mercadopago
```

> En producción (Vercel), estas variables se configuran en **Settings → Environment Variables**.

---

## Instalación y ejecución local

### Requisitos previos

- Node.js 18+
- PostgreSQL corriendo localmente
- Base de datos `magnolia_data` creada

### Backend

```bash
cd Back
npm install
npm run migration:run   # Crea las tablas
npm run start:dev       # Servidor en http://localhost:4000
```

Documentación Swagger disponible en: `http://localhost:4000/api`

### Frontend

```bash
cd Front
npm install
npm run dev             # App en http://localhost:3000
```

---

## Backend — NestJS

### Módulos

| Módulo | Responsabilidad |
|---|---|
| `auth` | Registro, login, verificación por email, 2FA admin, reset de contraseña, gestión de perfil, bloqueo de usuarios |
| `products` | CRUD de productos, filtros por categoría/tipo/subtipo/etiquetas, subida de imágenes |
| `order` | Creación y gestión de órdenes, estados, datos de envío |
| `mercado-pago` | Creación de preferencias de pago, webhook de notificaciones |
| `product-ratings` | Calificaciones (1-5 estrellas) y comentarios por producto |
| `image-upload` | Integración con Cloudinary para subir/eliminar imágenes |
| `mail` | Envío de emails transaccionales (verificación, 2FA, reset de contraseña) |
| `admin` | Métricas del dashboard administrativo (ventas mensuales, órdenes por estado) |

---

### Base de datos y entidades

#### User (auth)

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | PK |
| email | string | Único |
| username | string | Nombre visible |
| phone | string | Teléfono |
| password | string | Hash bcrypt |
| isAdmin | boolean | Rol administrador |
| isVerified | boolean | Email verificado |
| blockedAt | Date | Fecha de bloqueo (null = activo) |
| tokenVersion | number | Invalidación de sesiones |
| registrationCode | string | Código de verificación de registro |
| resetPasswordCode | string | Código de reset de contraseña |

#### Product

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | PK |
| name | string | Nombre |
| description | string | Descripción |
| price | decimal | Precio |
| stock | int | Stock disponible |
| imageUrl | string | URL Cloudinary |
| isFeatured | boolean | Destacado en home |
| averageRating | decimal | Promedio de calificaciones |
| ratingCount | int | Cantidad de calificaciones |
| category | enum | Categoría principal |
| productType | enum | Tipo (anillos, aros, cadenas, etc.) |
| *_subtype | enum | Subtipos específicos por tipo de producto |
| tags | string[] | Etiquetas (simple-array) |

#### Order

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | PK |
| totalPrice | decimal | Total de la orden |
| status | enum | PENDING / PROCESSING / SHIPPED / DELIVERED |
| shippingMethod | enum | NACIONAL / INTERNACIONAL |
| address, city, zipCode, state | string | Datos de envío |
| recipientName, recipientPhone | string | Datos del destinatario |
| createdAt | timestamp | Fecha de creación |

#### OrderItem

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | PK |
| quantity | int | Cantidad |
| price | decimal | Precio al momento de compra |
| Relaciones | — | ManyToOne(Order), ManyToOne(Product) |

#### ProductRating

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | PK |
| rating | int | 1 a 5 estrellas |
| comment | string | Comentario opcional |
| createdAt | timestamp | Fecha |
| Relaciones | — | ManyToOne(User), ManyToOne(Product) |

#### Payment

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | PK |
| status | string | Estado del pago en Mercado Pago |
| amount | decimal | Monto |
| mercadoPagoPaymentId | string | ID en Mercado Pago |
| externalReference | string | Referencia interna (orderId) |
| Relaciones | — | ManyToOne(Order), ManyToOne(User) |

---

### Endpoints de la API

#### Autenticación — `/auth`

```
POST   /auth/register                        Registro (envía código por email)
POST   /auth/verify-registration             Verificar código de registro
POST   /auth/login                           Login (devuelve JWT)
POST   /auth/verify-admin-login              2FA para administradores
POST   /auth/forgot-password                 Solicitar código de reset
POST   /auth/verify-code                     Verificar código de reset
POST   /auth/reset-password                  Cambiar contraseña con código
POST   /auth/request-change-password-code    Pedir código (usuario logueado)
PUT    /auth/change-password/:id             Cambiar contraseña (requiere token)
PUT    /auth/profile/:id                     Actualizar perfil (requiere token)
GET    /auth/profile/:id                     Obtener perfil (requiere token)
GET    /auth/shipping-data/:id               Obtener datos de envío guardados
DELETE /auth/delete-account/:id              Eliminar cuenta propia
GET    /auth/users                           Listar usuarios paginados (Admin)
GET    /auth/users/search                    Buscar usuarios (Admin)
PUT    /auth/block/:id                       Bloquear usuario (Admin)
PUT    /auth/unblock/:id                     Desbloquear usuario (Admin)
```

#### Productos — `/products`

```
POST   /products                             Crear producto con imagen (Admin)
PATCH  /products/:id                         Actualizar producto (Admin)
DELETE /products/:id                         Eliminar producto (Admin)
GET    /products                             Listar con filtros y paginación
GET    /products/:id                         Detalle de producto
PUT    /products/:id/image                   Actualizar imagen (Admin)
DELETE /products/:id/image                   Eliminar imagen (Admin)
DELETE /products/:id/tags/:tag               Eliminar etiqueta (Admin)
GET    /products/categories                  Categorías disponibles
GET    /products/types                       Tipos disponibles
GET    /products/subtypes/:type              Subtipos por tipo
GET    /products/tags                        Todas las etiquetas
GET    /products/tags/:tags                  Filtrar por etiquetas
```

#### Órdenes — `/order`

```
POST   /order                                Crear orden (requiere token)
GET    /order                                Listar todas las órdenes (Admin)
GET    /order/shipping-methods               Métodos de envío disponibles
GET    /order/:id                            Detalle de orden (requiere token)
GET    /order/:id/status                     Estado de una orden
PATCH  /order/:id/status                     Actualizar estado (Admin)
PATCH  /order/:id/add-product                Agregar producto a orden pendiente
DELETE /order/:id/product/:productId         Quitar producto de orden pendiente
```

#### Mercado Pago — `/mercado-pago`

```
POST   /mercado-pago/create-preference       Crear preferencia de pago
POST   /mercado-pago/webhook                 Webhook de notificaciones (público)
```

#### Calificaciones — `/product-ratings`

```
POST   /product-ratings                      Crear o actualizar calificación
GET    /product-ratings/:productId           Calificaciones de un producto
GET    /product-ratings/:productId/average   Promedio de calificaciones
```

#### Métricas Admin — `/admin`

```
GET    /admin/metrics/sales                  Ventas mensuales (Admin)
GET    /admin/metrics/orders                 Órdenes por estado (Admin)
```

---

### Seguridad

- **JWT** con expiración de 30 días y **token versioning** (permite invalidar todas las sesiones activas de un usuario)
- **Contraseñas** hasheadas con bcrypt (10 rounds)
- **Rate limiting** con `@nestjs/throttler`:
  - Global: 100 requests / 60 segundos
  - `/auth/register`: 5 requests / 60 segundos
  - `/auth/login`: 10 requests / 60 segundos
- **Guards**: `AuthGuard` (valida JWT + versioning) y `RolesGuard` (verifica rol Admin/User)
- **Validación** con `class-validator`: passwords con mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 símbolo
- **2FA por email** para administradores al hacer login
- **Códigos de verificación** de 6 dígitos con expiración de 15 minutos
- **CORS** configurable por variable de entorno

---

### Integraciones externas

#### Cloudinary
- Almacenamiento de imágenes de productos
- Upload vía `multipart/form-data`
- Métodos disponibles: `uploadImage`, `deleteImage`, `deleteImageByUrl`

#### Mercado Pago
- SDK versión 2
- Crea preferencias de pago con items, datos del comprador y URLs de retorno
- Webhook en `/mercado-pago/webhook` actualiza el estado de la orden y del registro de pago automáticamente

#### Nodemailer (Gmail)
- SMTP: `smtp.gmail.com:587`
- Plantillas HTML personalizadas para:
  - Verificación de cuenta en el registro
  - Código 2FA para login de admin
  - Reset de contraseña
  - Confirmación de cambio de contraseña

---

## Frontend — Next.js

### Páginas y rutas

#### Públicas

| Ruta | Descripción |
|---|---|
| `/` | Home con hero, productos destacados y categorías |
| `/auth/login` | Formulario de login |
| `/auth/registro` | Formulario de registro con verificación por email |
| `/recuperar-clave` | Recuperación de contraseña |
| `/categoria/[categoria]` | Productos filtrados por categoría (ruta dinámica) |
| `/producto/[id]` | Detalle de producto con calificaciones (ruta dinámica) |
| `/envios` | Información de métodos y tiempos de envío |
| `/cuidado` | Instrucciones de cuidado de joyas |
| `/faq` | Preguntas frecuentes |
| `/cambios` | Política de cambios y devoluciones |
| `/privacidad` | Política de privacidad |
| `/terminos` | Términos y condiciones |

#### Protegidas (requieren login)

| Ruta | Descripción |
|---|---|
| `/perfil` | Dashboard de perfil de usuario |
| `/perfil/orden/[id]` | Detalle de una orden |
| `/favoritos` | Wishlist del usuario |
| `/checkout` | Carrito y proceso de pago |
| `/checkout/success` | Confirmación de pago aprobado |
| `/checkout/failure` | Pantalla de pago rechazado |
| `/checkout/pending` | Pantalla de pago pendiente |

#### Admin (requieren isAdmin)

| Ruta | Descripción |
|---|---|
| `/admin` | Dashboard con métricas de ventas y órdenes |
| `/admin/productos` | CRUD completo de productos |
| `/admin/pedidos` | Gestión y actualización de estado de órdenes |
| `/admin/usuarios` | Listado, búsqueda, bloqueo y desbloqueo de usuarios |

---

### Componentes principales

#### Layout
- `Navbar` — Navegación principal con categorías, carrito y acceso a perfil
- `Footer` — Links institucionales y redes sociales
- `CartSidebar` — Panel lateral deslizable del carrito de compras
- `AdminBar` — Barra de acceso rápido al panel admin (visible solo para admins)

#### Home
- `Hero` — Banner principal animado
- `FeaturedProducts` — Productos con `isFeatured: true`
- `CategoryGrid` — Grid visual de categorías
- `PromoBanner` — Banner de promociones

#### Autenticación
- `LoginForm` — Login con soporte 2FA para administradores
- `RegisterForm` — Registro en 2 pasos: datos personales + verificación de email
- `ForgotPassword` — Recuperación de contraseña por código de email

#### Perfil
- `ProfileDashboard` — Vista general del perfil del usuario
- `ProfileSidebar` — Navegación lateral entre secciones del perfil
- `ProfileForm` — Edición de datos personales (nombre, teléfono, dirección)
- `SecuritySettings` — Cambio de contraseña desde perfil
- `OrdersList` — Historial de órdenes del usuario

#### Productos
- `AddToCartButton` — Agrega producto al carrito con validación de stock
- `WishlistButton` — Agrega o quita producto de favoritos
- `RatingForm` — Formulario de calificación (1-5 estrellas + comentario)

#### Checkout
- `MercadoPagoButton` — Crea la preferencia de pago y redirige al gateway

#### Admin
- `ListaProductos` — Tabla de productos con acciones de editar/eliminar
- `CrearProducto` / `ProductForm` — Formulario para crear/editar productos con imagen
- `EditProductModal` — Modal de edición rápida de producto
- `ListaPedidos` — Tabla de órdenes con selector de estado
- `ListaUsuarios` — Tabla de usuarios con acciones de bloqueo/desbloqueo

#### Utilidades
- `Toast` (helpers) — Notificaciones de éxito y error con `react-hot-toast`

---

### Estado global (Contexts)

#### AuthContext

```typescript
{
  isLoggedIn: boolean
  token: string | null
  user: { id, email, isAdmin, username, phone, address } | null
  loading: boolean
  login(token: string): Promise<void>
  logout(): void
  checkLogin(): void
}
```

- Decodifica el JWT con `jwt-decode`
- Persiste `token` y `user` en `localStorage`
- Soporte a token versioning para detección de sesiones invalidadas

#### CartContext

```typescript
{
  items: CartItem[]
  addToCart(product): void
  removeFromCart(id): void  // Elimina el item completo
  removeOne(id): void       // Reduce cantidad en 1
  clearCart(): void
  totalPrice: number
  totalItems: number
  isCartOpen: boolean
  toggleCart(): void
}
```

- Persiste en `localStorage` con clave `magnolia-cart-{userId}` para usuarios logueados o `magnolia-cart-guest` para invitados
- Carrito separado por usuario

#### WishlistContext

- Misma estructura que CartContext
- Gestiona la lista de productos favoritos del usuario
- Persiste en `localStorage`

---

### Hooks personalizados

| Hook | Descripción |
|---|---|
| `useProducts(filters)` | Listado de productos con filtros de categoría, tipo, subtipo y etiquetas. Caché con SWR |
| `useCategories()` | Categorías de productos disponibles en el backend |
| `useProductTypes()` | Tipos de productos disponibles |
| `useSubtypes(type)` | Subtipos filtrados por tipo de producto |
| `useOrders()` | Todas las órdenes (uso admin) |
| `useOrder(id)` | Detalle de una orden específica |
| `useMetricsSales()` | Métricas de ventas mensuales para el dashboard admin |
| `useMetricsOrders()` | Métricas de órdenes agrupadas por estado |

---

### Flujo de pagos

1. Usuario revisa el carrito en `/checkout`
2. Completa los datos de envío (nombre, dirección, ciudad, código postal, método de envío)
3. El frontend crea la orden: `POST /order` → recibe `orderId`
4. Con el `orderId`, solicita la preferencia de pago: `POST /mercado-pago/create-preference`
5. El backend retorna `preference.id` con el `init_point` de Mercado Pago
6. El usuario es redirigido al checkout de Mercado Pago
7. Según el resultado, Mercado Pago redirige a:
   - `/checkout/success` — pago aprobado
   - `/checkout/failure` — pago rechazado
   - `/checkout/pending` — pago en revisión
8. El webhook en `POST /mercado-pago/webhook` actualiza el estado de la orden y registra el pago en la base de datos

---

## Flujos principales

### Registro de usuario

1. Usuario completa el formulario (nombre, apellido, email, teléfono, contraseña)
2. `POST /auth/register` → backend genera código de 6 dígitos y envía email
3. Usuario ingresa el código en el formulario de verificación
4. `POST /auth/verify-registration` → activa la cuenta (`isVerified: true`)
5. Usuario puede hacer login

### Login

1. `POST /auth/login` con email + contraseña
2. Si es usuario normal → backend retorna JWT directamente
3. Si es admin → backend envía código 2FA por email, frontend muestra campo de código
4. `POST /auth/verify-admin-login` con el código → retorna JWT
5. Frontend decodifica el JWT, guarda token y datos de usuario en localStorage
6. Redirige a `/` (usuario) o `/admin` (admin)

### Gestión de productos (Admin)

1. Admin accede a `/admin/productos`
2. Puede crear un nuevo producto con imagen (subida a Cloudinary vía multipart)
3. Puede editar nombre, descripción, precio, stock, categoría, tipo, subtipos y etiquetas
4. Puede marcar un producto como destacado (`isFeatured`) para mostrarlo en el home
5. Puede eliminar solo la imagen o el producto completo

### Gestión de usuarios (Admin)

1. Admin accede a `/admin/usuarios`
2. Ve la lista paginada con búsqueda
3. Puede bloquear (`PUT /auth/block/:id`) o desbloquear (`PUT /auth/unblock/:id`) usuarios
4. Los usuarios bloqueados reciben mensaje de error al intentar hacer login

---

## Deploy

| Servicio | Plataforma |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Base de datos | PostgreSQL (Render o Railway) |
| Imágenes | Cloudinary |

### Variables de entorno en producción

En **Vercel** (Frontend), configurar en Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL` → URL pública del backend en Render (ej: `https://tu-backend.onrender.com`)
- `NEXT_PUBLIC_MP_PUBLIC_KEY` → Public key de Mercado Pago

En **Render** (Backend), configurar como Environment Variables:
- Todas las variables del archivo `Back/.env` con sus valores de producción
- `CORS_ORIGIN` → URL del frontend en Vercel
- `MP_BASE_URL` y `MP_NOTIFICATION_URL` → URL pública del backend en Render

### Scripts de producción

```bash
# Backend
npm run build           # Compilar TypeScript
npm run migration:run   # Ejecutar migraciones pendientes
npm run start:prod      # Iniciar servidor producción

# Frontend
npm run build           # Build optimizado de Next.js
npm run start           # Iniciar servidor Next.js
```
