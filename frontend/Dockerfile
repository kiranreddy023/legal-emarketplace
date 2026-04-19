# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build argument for API URL
ARG REACT_APP_API_BASE_URL=http://localhost:5000

# Set as environment variable during build
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Production stage - use nginx to serve the built app
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create a non-root user for security
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001 || true

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
