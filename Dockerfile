# Gunakan image Node.js sebagai base image
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Salin package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua file dan build aplikasi
COPY . .
RUN npm run build

# Gunakan image Nginx untuk melayani aplikasi
FROM nginx:alpine

# Salin hasil build ke Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Salin file konfigurasi Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port yang digunakan oleh Cloud Run
EXPOSE 8080

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]