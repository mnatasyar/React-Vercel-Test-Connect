# Build stage
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Salin seluruh kode sumber
COPY . .

# Build aplikasi
RUN npm run build

# Production stage
FROM nginx:alpine

# Salin hasil build
COPY --from=builder /app/dist /usr/share/nginx/html

# Salin konfigurasi nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 untuk Cloud Run
EXPOSE 8080

# Ganti user nginx untuk keamanan
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]