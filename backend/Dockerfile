# Etapa 1: Instalar dependencias
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Etapa 2: Imagen de ejecución reducida
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src/ ./src/

EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
