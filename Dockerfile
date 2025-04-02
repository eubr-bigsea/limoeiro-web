FROM node:18-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia package.json e instala dependências
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copia o código-fonte e constrói a aplicação
COPY . .
RUN npm run build

# Usa uma imagem nginx para servir a aplicação
FROM nginx:alpine

# Copia os arquivos da build para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]

