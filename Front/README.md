# Magnolia Joyas 💎

E-commerce completo para joyería desarrollado con Next.js y NestJS, con diseño elegante y funcionalidades modernas para compra online de productos de plata, oro y accesorios personalizados.

## 📋 Descripción

Magnolia Joyas es una plataforma de comercio electrónico full-stack especializada en la venta de joyería. El proyecto incluye un catálogo de productos con sistema de categorización jerárquica, carrito de compras, lista de deseos, y sistema de autenticación de usuarios. Construido con tecnologías modernas y arquitectura escalable.

## ✨ Características Principales

### Frontend
- 🏠 **Página de inicio** con productos destacados y animaciones 3D
- 🔍 **Sistema de categorías** jerárquico (Categorías → Tipos → Subtipos)
- 🛒 **Carrito de compras** con persistencia en LocalStorage
- ❤️ **Lista de favoritos** para guardar productos
- 👤 **Páginas de login y registro** con formularios validados
- 📱 **Diseño responsive** con Tailwind CSS
- 🎨 **Paleta de colores personalizada** para estética premium
- ⚡ **Animaciones fluidas** con efectos hover y transiciones

### Backend
- 🔌 **API RESTful** con NestJS
- 📊 **Base de datos PostgreSQL** con TypeORM
- 📚 **Documentación automática** con Swagger
- 🌱 **Sistema de seeds** para datos iniciales
- 🔄 **Relaciones de entidades** bien estructuradas
- ✅ **Validación de datos** con class-validator
- 🐳 **Dockerizado** para fácil despliegue

### Funcionalidades Implementadas
- ✅ CRUD completo de productos
- ✅ Filtrado por categoría, tipo y subtipo
- ✅ Gestión de carrito (agregar, eliminar, modificar cantidades)
- ✅ Sistema de wishlist/favoritos
- ✅ 5 categorías principales con múltiples subcategorías
- ✅ 10 productos de ejemplo precargados
- ✅ Integración completa frontend-backend

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Next.js** | 16.0.4 | Framework React con App Router |
| **React** | 19.2.0 | Biblioteca UI |
| **TypeScript** | 5.x | Tipado estático |
| **Tailwind CSS** | 4.x | Estilos y diseño responsive |
| **Lucide React** | 554.0 | Iconografía |
| **Context API** | - | Manejo de estado global |

### Backend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **NestJS** | 11.0.1 | Framework Node.js |
| **TypeORM** | 0.3.27 | ORM para PostgreSQL |
| **PostgreSQL** | 15 | Base de datos |
| **Swagger** | 11.2.3 | Documentación API |
| **class-validator** | - | Validación de DTOs |
| **Docker** | - | Containerización |

## 📁 Estructura del Proyecto

```
magnolia-joyas/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Página principal
│   ├── layout.tsx                # Layout raíz
│   ├── ingresar/                 # Página de login
│   ├── registro/                 # Página de registro
│   ├── categoria/                # Navegación por categorías
│   ├── producto/[id]/            # Detalle de producto
│   ├── favoritos/                # Lista de deseos
│   └── checkout/                 # Proceso de compra
├── components/                   # Componentes React
│   ├── Navbar.tsx                # Barra de navegación
│   ├── CartSidebar.tsx           # Panel lateral del carrito
│   ├── FeaturedProducts.tsx      # Productos destacados
│   ├── CategoryGrid.tsx          # Grilla de categorías
│   └── ...
├── context/                      # Context API
│   ├── CartContext.tsx           # Estado del carrito
│   └── WishlistContext.tsx       # Estado de favoritos
├── data/                         # Datos estáticos
│   ├── menuData.ts               # Datos del menú
│   └── products.ts               # Productos de ejemplo
├── Back/magnola-api/             # Backend NestJS
│   ├── src/
│   │   ├── products/             # Módulo de productos
│   │   │   ├── entities/         # Entidades TypeORM
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── products.controller.ts
│   │   │   └── products.service.ts
│   │   └── main.ts               # Bootstrap de la aplicación
│   └── docker-compose.yml        # Configuración Docker
└── public/                       # Archivos estáticos
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ y npm
- Docker y Docker Compose
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/VMGaray/magnolia_joyas.git
cd magnolia-joyas
```

### 2. Configurar Frontend
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```
El frontend estará disponible en `http://localhost:3000`

### 3. Configurar Backend

#### a) Iniciar Base de Datos con Docker
```bash
cd Back/magnola-api

# Levantar PostgreSQL
docker-compose up -d
```

#### b) Configurar Variables de Entorno
Crear archivo `.env` en `Back/magnola-api/`:
```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=magnolia_data
PORT=4000
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
NODE_ENV=development
```

#### c) Instalar Dependencias y Ejecutar
```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run start:dev
```
El backend estará disponible en `http://localhost:4000`

La documentación Swagger estará en `http://localhost:4000/api`

### 4. Poblar Base de Datos (Opcional)
```bash
# Crear categorías, tipos y subtipos
POST http://localhost:4000/products/seed

# Crear 10 productos de ejemplo
POST http://localhost:4000/products/seed-products
```

## 📖 Uso

### Navegación en el Sitio
1. **Página Principal**: Ver productos destacados y categorías
2. **Explorar Categorías**: Navegar por Plata 925, Oro 18k, Enchapados, etc.
3. **Detalle de Producto**: Click en cualquier producto para ver detalles
4. **Agregar al Carrito**: Botón "Agregar al Carrito" en cada producto
5. **Gestionar Carrito**: Panel lateral deslizable con resumen y acciones
6. **Lista de Deseos**: Marcar productos favoritos con el ícono de corazón
7. **Checkout**: Proceder a la compra desde el carrito

### Categorías Disponibles
- **Plata 925**: Anillos, Aros, Cadenas, Pulseras, Dijes, Piezas por Unidad, Outlet
- **Oro 18k**: Colecciones de alta gama
- **Enchapados**: Productos con baño de oro
- **Personalizados**: Joyería a medida
- **Insumos**: Materiales y componentes

## 🔌 API Endpoints

### Productos
```
GET    /products                    # Obtener todos los productos (con filtros opcionales)
GET    /products?category=1         # Filtrar por categoría
GET    /products?type=2             # Filtrar por tipo
GET    /products?subtype=3          # Filtrar por subtipo
POST   /products                    # Crear nuevo producto
```

### Categorías y Clasificación
```
GET    /products/categories         # Obtener todas las categorías
GET    /products/product-types      # Obtener tipos de productos
GET    /products/subtypes           # Obtener subtipos
```

### Utilidades
```
POST   /products/seed               # Poblar categorías y tipos
POST   /products/seed-products      # Crear productos de ejemplo
```

**Documentación Completa**: Visita `http://localhost:4000/api` para Swagger UI

## 📊 Modelo de Datos

### Entidades Principales

#### Product
```typescript
{
  id: number
  name: string
  description: string
  price: decimal
  imageUrl?: string
  category: Category
  productType: ProductType
  subtype?: Subtype
}
```

#### Category
```typescript
{
  id: number
  name: string
  types: ProductType[]
  products: Product[]
}
```

### Relaciones
- **Category** 1:N **ProductType** 1:N **Subtype**
- **Product** pertenece a Category, ProductType y opcionalmente Subtype

## 🎨 Características de Diseño

- **Paleta de Colores Custom**:
  - `magnolia-dark`: Color principal oscuro
  - `magnolia-lilac`: Color acento lila
  - `magnolia-light`: Fondo claro

- **Tipografía**:
  - **Playfair Display**: Títulos elegantes
  - **Lato**: Texto de cuerpo

- **Animaciones**:
  - Tarjetas de producto con efecto flip 3D
  - Transiciones suaves en hover
  - Panel lateral del carrito con slide

## 🧪 Testing

```bash
# Backend tests
cd Back/magnola-api

# Tests unitarios
npm test

# Tests con cobertura
npm run test:cov

# Tests e2e
npm run test:e2e
```

## 📝 Scripts Disponibles

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm start            # Servidor de producción
npm run lint         # Linting
```

### Backend
```bash
npm run start:dev    # Desarrollo con watch mode
npm run build        # Compilar
npm start            # Producción
npm run lint         # Linting y autofix
npm test             # Tests
```

## 🌟 Próximas Funcionalidades

- [ ] Sistema de autenticación completo (JWT)
- [ ] Perfiles de usuario
- [ ] Gestión de órdenes
- [ ] Integración de pagos (Stripe/MercadoPago)
- [ ] Sistema de reseñas y valoraciones
- [ ] Búsqueda global de productos
- [ ] Panel de administración
- [ ] Gestión de inventario
- [ ] Envío de emails transaccionales
- [ ] Multi-idioma completo (ES/EN)

## 👩‍💻 Autora

**Victoria Garay**

- GitHub: [@VMGaray](https://github.com/VMGaray)
- Portfolio: [Tu Portfolio URL]
- LinkedIn: [Tu LinkedIn]

## 📄 Licencia

Este proyecto es de código privado. Todos los derechos reservados.

---

⭐ **¿Te gusta el proyecto?** Dale una estrella en GitHub

💼 **Portfolio**: Este proyecto forma parte de mi portfolio de desarrollo full-stack

🔗 **Demo en vivo**: [Agregar URL cuando esté deployed]
