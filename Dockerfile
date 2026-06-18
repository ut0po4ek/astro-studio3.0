# ── Stage 1: Build ─────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Astro static site + compile TypeScript server code
RUN npm run build

# ── Stage 2: Runtime ───────────────────────────────────────
FROM node:22-alpine
WORKDIR /app

# Static site output
COPY --from=builder /app/dist ./dist

# Compiled server TypeScript → JS
COPY --from=builder /app/dist-server ./dist-server

# Express entry point
COPY server.js ./

# Package manifests (for npm ci --omit=dev)
COPY package*.json ./

# Install only production dependencies (express, nodemailer)
RUN npm ci --omit=dev

EXPOSE 80
CMD ["node", "server.js"]
