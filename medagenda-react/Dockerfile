# Dockerfile Multi-stage para o Frontend React.js + Vite
# Sistema MedAgenda - UFPA 2026.1

# Estágio 1: Build de produção com Node.js
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio 2: Servidor Web Nginx ultraleve para SPA + Proxy API
FROM nginx:alpine

# Copiar build gerado na etapa 1 para o diretório web do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar arquivo de configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
