# Production-ready image for the Monotickets frontend (guest app)
FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@10.18.0 --activate

# Install dependencies with pnpm using workspace filters for the guest app
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY packages ./packages
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/guest/package.json ./apps/guest/package.json
COPY apps/staff/package.json ./apps/staff/package.json
COPY apps/superadmin/package.json ./apps/superadmin/package.json
RUN pnpm install --filter guest... --frozen-lockfile

# Build the Next.js application with standalone output
FROM base AS builder
ARG NEXT_PUBLIC_API_URL=https://api.monotickets.com
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm install --filter guest... --frozen-lockfile
RUN pnpm --filter guest... build

# Final runtime image using the standalone server
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ARG NEXT_PUBLIC_API_URL=https://api.monotickets.com
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY --from=builder /app/apps/guest/.next/standalone ./
COPY --from=builder /app/apps/guest/.next/static ./apps/guest/.next/static
COPY --from=builder /app/apps/guest/public ./apps/guest/public
EXPOSE 3000
CMD ["node", "apps/guest/server.js"]
