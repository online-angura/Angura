# Angura

Tienda online de ropa underground construida con React y Vite.

## Requisitos

- Node.js LTS
- npm
- Git, si vas a publicar en GitHub

## Instalación

Desde la raíz del proyecto:

```powershell
npm install
```

## Desarrollo local

Inicia el servidor:

```powershell
npm run dev
```

Abre la tienda en:

```text
http://127.0.0.1:3000/store
```

El editor privado está en:

```text
http://127.0.0.1:3000/editor
```

## Scripts disponibles

```powershell
npm run dev      # Inicia Vite en modo desarrollo
npm run build    # Genera la versión de producción
npm run start    # Sirve la versión compilada
npm run setup    # Instala las dependencias
```

## Variables de entorno

Copia el archivo de ejemplo:

```powershell
Copy-Item apps/wed/.env.example apps/wed/.env
```

Configura las credenciales del editor en `apps/wed/.env`:

```env
VITE_ADMIN_EMAIL=tu-correo@ejemplo.com
VITE_ADMIN_PASSWORD=tu-contrasena
```

No subas `.env` a GitHub. El archivo está incluido en `.gitignore`.

## Estructura principal

```text
apps/wed/
├── public/
│   ├── 404.html              # Fallback para las rutas de GitHub Pages
│   └── angura-brand.svg      # Imagen principal de Angura
├── src/
│   ├── components/           # Componentes reutilizables
│   ├── contexts/
│   │   ├── AuthContext.jsx   # Acceso local al editor
│   │   └── LanguageContext.jsx
│   ├── data/
│   │   └── products.js       # Productos, imágenes y configuración
│   ├── lib/
│   │   └── catalog.js        # Catálogo guardado en el navegador
│   ├── pages/
│   │   ├── HomePage.jsx      # Tienda y carrito
│   │   ├── LoginPage.jsx     # Inicio de sesión del editor
│   │   └── EditorPage.jsx    # Gestión de productos
│   ├── App.jsx               # Rutas de la aplicación
│   └── main.jsx              # Punto de entrada
└── vite.config.js            # Configuración local y GitHub Pages
```

## Cambiar productos e imágenes

Puedes modificar los productos desde:

```text
http://127.0.0.1:3000/editor
```

El editor permite:

- Añadir productos.
- Cambiar nombres, detalles, precios y tallas.
- Cambiar imágenes mediante URL o archivo.
- Eliminar productos.
- Restaurar el catálogo original.

Actualmente, los cambios del editor se guardan en `localStorage` del navegador. Por eso son locales a cada navegador y dispositivo; no se sincronizan automáticamente entre clientes.

Para cambiar los productos iniciales del código, edita:

```text
apps/wed/src/data/products.js
```

## Idiomas

La tienda incluye español e inglés. El selector `ES / EN` aparece en la barra superior.

Las traducciones están en:

```text
apps/wed/src/contexts/LanguageContext.jsx
```

El idioma elegido se guarda en el navegador.

## Pedidos por Instagram

Al finalizar una compra:

1. Se genera un mensaje con productos, tallas, cantidades y total.
2. El mensaje se copia al portapapeles.
3. Se abre el chat de Instagram de Angura.
4. El cliente pega el mensaje y lo envía.

Instagram no permite enviar mensajes automáticamente desde una página sin usar su API oficial y permisos específicos.

## Compilar para producción

```powershell
npm run build
```

La salida se genera en:

```text
apps/wed/dist/
```

## Publicar en GitHub Pages

El proyecto incluye un workflow en:

```text
.github/workflows/deploy-pages.yml
```

Para publicar:

```powershell
git add .
git commit -m "Actualizar tienda Angura"
git push origin main
```

En GitHub, activa:

```text
Settings → Pages → Source → GitHub Actions
```

La configuración actual usa el repositorio `online-angura/Angura.github.io`, por lo que la tienda se publica en:

```text
https://online-angura.github.io/store
```

El workflow utiliza estos secretos de GitHub para el acceso al editor:

```text
VITE_ADMIN_EMAIL
VITE_ADMIN_PASSWORD
```

Configúralos en:

```text
Settings → Secrets and variables → Actions
```

## Verificación

Antes de subir cambios, ejecuta:

```powershell
npm run build
```

Si la compilación termina con `built`, la versión de producción se generó correctamente.
