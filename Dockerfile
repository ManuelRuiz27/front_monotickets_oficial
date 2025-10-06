# Base environment with pnpm enabled
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.18.0 --activate

# Install dependencies once to leverage Docker layer caching
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile

# Build the selected application
FROM base AS builder
ARG APP_NAME=admin
ARG APP_DIR=apps/admin
ARG NEXT_PUBLIC_API_URL=https://api.monotickets.com
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV APP_NAME=${APP_NAME}
ENV APP_DIR=${APP_DIR}
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm install --frozen-lockfile
RUN pnpm --filter ${APP_NAME}... build

# Final runtime image
FROM base AS runner
ARG APP_NAME=admin
ARG APP_DIR=apps/admin
ARG NEXT_PUBLIC_API_URL=https://api.monotickets.com
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV APP_NAME=${APP_NAME}
ENV APP_DIR=${APP_DIR}
WORKDIR /app
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/${APP_DIR} ./apps/${APP_DIR}
EXPOSE 3000
CMD ["sh", "-c", "pnpm --filter \"$APP_NAME\" start"]
