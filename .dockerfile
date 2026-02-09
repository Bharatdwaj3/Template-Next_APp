# Stage 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js app (produces .next + standalone output)
RUN npm run build

# Stage 2: Production image (small & secure)
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only what's needed from builder
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Environment variables (set at runtime or via docker-compose)
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]