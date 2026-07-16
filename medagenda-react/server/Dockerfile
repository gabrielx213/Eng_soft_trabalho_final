# Dockerfile para o Backend Node.js / Express / Prisma
# Sistema MedAgenda - UFPA 2026.1
FROM node:20-alpine

WORKDIR /app

# Instalar dependências necessárias para o Prisma no Alpine
RUN apk add --no-cache openssl

# Copiar arquivos de descrição de pacotes e schema do Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências e gerar o Prisma Client
RUN npm install
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/medagenda_db?schema=public"
RUN npx prisma generate

# Copiar todo o código fonte da aplicação backend
COPY . .

# Expor a porta 5000 do servidor Express
EXPOSE 5000

# Comando padrão ao iniciar o container: rodar migrations/push, popular seed e iniciar API
CMD [ "npm", "run", "start:docker" ]
