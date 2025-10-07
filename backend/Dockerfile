### backend/Dockerfile
# Multi-stage build for a Node.js Express backend optimized for production.

# Stage 1 - build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# install build deps and copy package.json first for caching
COPY package.json package-lock.json ./
RUN npm ci --production

# copy source
COPY . .

# Stage 2 - runtime
FROM node:20-alpine
WORKDIR /usr/src/app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only production node_modules and source
COPY --from=builder /usr/src/app /usr/src/app

# Expose the API port
EXPOSE 4000

# Set NODE_ENV
ENV NODE_ENV=production

# Use non-root user
USER appuser

# Start app using node (PM2 optional via DEPLOYMENT instructions)
CMD ["node", "src/server.js"]
