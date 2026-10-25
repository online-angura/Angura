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

Inicia Vite desde la raíz:

```powershell
npm run dev
```

Vite muestra en la terminal la dirección para abrir la tienda.

## Scripts disponibles

```powershell
npm run dev      # Inicia Vite en modo desarrollo
npm run build    # Genera la versión de producción
npm run start    # Sirve la versión compilada
npm run setup    # Instala las dependencias
```

No se requieren variables de entorno para la tienda.

## Estructura principal

```text
apps/wed/
├── public/
│   ├── 404.html              # Fallback para las rutas de GitHub Pages
│   └── angura-brand.svg      # Imagen principal de Angura
├── src/
│   ├── components/           # Componentes reutilizables
│   ├── contexts/
│   │   └── LanguageContext.jsx
│   ├── data/
│   │   ├── products.json     # Catálogo administrado con Pages CMS
│   │   └── products.js       # Datos y configuración de productos
│   ├── lib/
│   │   └── catalog.js        # Lectura estática del catálogo
│   ├── pages/
│   │   ├── HomePage.jsx      # Tienda y carrito
│   ├── App.jsx               # Rutas de la aplicación
│   └── main.jsx              # Punto de entrada
└── vite.config.js            # Configuración local y GitHub Pages
```

## Cambiar productos e imágenes

Administra los productos en [Pages CMS](https://app.pagescms.org), autorizando la aplicación en el repositorio `online-angura/Angura`. Cada guardado crea un commit en GitHub; el workflow compila y publica automáticamente el cambio en GitHub Pages.

El archivo de catálogo es:

```text
apps/wed/src/data/products.json
```

La configuración de Pages CMS está en `.pages.yml`. Las imágenes se guardan en:

```text
apps/wed/public/uploads/
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
.github/workflows/deploy.yml
```

Para publicar, crea el repositorio con este nombre:

```text
online-angura/Angura
```

Y luego ejecuta:

```powershell
git add .
git commit -m "Actualizar tienda Angura"
git push origin main
```

En GitHub, activa:

```text
Settings → Pages → Source → GitHub Actions
```

La página se publicará en:

```text
https://online-angura.github.io/Angura/
```

Si quieres acceder directamente a la tienda, normalmente será en:

```text
https://online-angura.github.io/Angura/store
```

## Verificación

Antes de subir cambios, ejecuta:

```powershell
npm run build
```

Si la compilación termina con `built`, la versión de producción se generó correctamente.
