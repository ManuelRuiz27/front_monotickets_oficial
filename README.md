# Monotickets en Docker

Este repositorio incluye la configuración necesaria para construir y ejecutar las cuatro aplicaciones Next.js del monorepo dentro de contenedores. Cada servicio puede ejecutarse de forma independiente o en conjunto mediante Docker Compose.

## Requisitos previos
- Docker 24+ (o la versión estable más reciente disponible en tu sistema)
- Docker Compose v2 integrado en Docker (`docker compose`)

## Variables de entorno
Todas las aplicaciones requieren `NEXT_PUBLIC_API_URL`. Puedes definirla a nivel global creando un archivo `.env` en la raíz:

```env
NEXT_PUBLIC_API_URL=https://api.monotickets.com
ADMIN_PORT=3000
STAFF_PORT=3001
GUEST_PORT=3002
SUPERADMIN_PORT=3003
```

Si no defines las variables de puerto, se usarán los valores por defecto mostrados arriba.

## Construir una imagen individual
Si solo necesitas una de las aplicaciones, construye la imagen pasando los argumentos adecuados.

```bash
# Ejemplo: construir y ejecutar la app de administración
docker build \
  --build-arg APP_NAME=admin \
  --build-arg APP_DIR=apps/admin \
  --build-arg NEXT_PUBLIC_API_URL="https://api.monotickets.com" \
  -t monotickets-admin .

docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="https://api.monotickets.com" \
  monotickets-admin
```

Reemplaza `APP_NAME` y `APP_DIR` con cualquiera de las otras aplicaciones (`staff`, `guest`, `superadmin`) y ajusta los puertos según lo que necesites.

## Ejecutar con Docker Compose
Para levantar varias aplicaciones a la vez, utiliza Docker Compose. Cada servicio construirá su propia imagen con los argumentos correctos.

```bash
# Construir y levantar admin + staff
docker compose up admin staff

# Construir y levantar todas las aplicaciones en paralelo
docker compose up --build
```

El archivo `docker-compose.yml` expone cada servicio en un puerto distinto (3000-3003 por defecto). Usa `CTRL+C` para detener los servicios y luego:

```bash
docker compose down
```

## Comandos útiles
- Inspeccionar logs de un servicio específico:
  ```bash
  docker compose logs -f admin
  ```
- Reconstruir una imagen tras cambios en el código:
  ```bash
  docker compose build admin
  ```
- Eliminar recursos creados por Compose (contenedores, redes, volúmenes anónimos):
  ```bash
  docker compose down -v
  ```

## Notas adicionales
- El `Dockerfile` usa pnpm y un build multi-stage. Ajusta `NEXT_PUBLIC_API_URL` para apuntar a tu API local o remota según corresponda.
- Si introduces nuevos paquetes en el monorepo, recuerda añadir sus `package.json` al contexto de copia para aprovechar la caché de dependencias en Docker.
