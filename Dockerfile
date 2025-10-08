FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@10.18.0 --activate

# Install all workspace dependencies in a dedicated layer to leverage build cache.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY packages ./packages
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/guest/package.json ./apps/guest/package.json
COPY apps/staff/package.json ./apps/staff/package.json
COPY apps/superadmin/package.json ./apps/superadmin/package.json
RUN pnpm install --frozen-lockfile

# Build every Next.js app in the monorepo so we can ship them together.
FROM base AS builder
ARG NEXT_PUBLIC_API_URL=https://api.monotickets.com
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm install --frozen-lockfile
RUN mkdir -p apps/admin/public apps/staff/public apps/guest/public apps/superadmin/public
RUN TURBO_FORCE=1 pnpm build

# Runtime image that boots the four Next.js applications inside a single container.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL=https://api.monotickets.com
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV ADMIN_PORT=3000
ENV STAFF_PORT=3001
ENV GUEST_PORT=3002
ENV SUPERADMIN_PORT=3003

# Copy the orchestrator script.
COPY --from=builder /app/scripts/start-all.js ./scripts/start-all.js

# Copy runtime dependencies and build artifacts.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages

RUN adduser --disabled-password --home /app monotickets \
  && chown -R monotickets:monotickets /app

USER monotickets

EXPOSE 3000 3001 3002 3003
CMD ["node", "scripts/start-all.js"]
