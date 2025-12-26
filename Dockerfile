# =============================================================================
# Build Stage
# =============================================================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files explicitly
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript application
RUN npm run build

# =============================================================================
# Production Stage
# =============================================================================
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy package files explicitly
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 9501

# Start the application
CMD ["node", "dist/server.js"]
