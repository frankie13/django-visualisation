# --- Build stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# --- Run stage ---
FROM nginx:alpine

# Copy built app to Nginx's default html dir
COPY --from=build /app/build /usr/share/nginx/html

# Simple SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
