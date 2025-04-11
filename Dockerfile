FROM node:18-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

ARG VITE_API_URL
ARG IDENTITY_CLIENT_ID
ARG PUBLIC_URL
ARG AUTH_URL
ARG REDIRECT_URL
ARG APIM_TOKEN_URL
ARG APIM_CONSUMER_KEY
ARG APIM_CONSUMER_SECRET
ARG IDENTITY_CLIENT_SECRET


# Copia package.json e instala dependências
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copia o código-fonte e constrói a aplicação
COPY . .

ENV VITE_API_URL $VITE_API_URL
ENV PUBLIC_URL $PUBLIC_URL
ENV AUTH_URL $AUTH_URL
ENV REDIRECT_URL $REDIRECT_URL
ENV IDENTITY_CLIENT_ID $IDENTITY_CLIENT_ID
ENV APIM_TOKEN_URL $APIM_TOKEN_URL
ENV APIM_CONSUMER_KEY $APIM_CONSUMER_KEY
ENV APIM_CONSUMER_SECRET $APIM_CONSUMER_SECRET
ENV IDENTITY_CLIENT_SECRET $IDENTITY_CLIENT_SECRET

RUN npm run build

# Usa uma imagem nginx para servir a aplicação
FROM nginx:alpine

RUN apk update && apk add openssl

COPY --from=build /app/dist /var/www
RUN mkdir -p /etc/nginx/ssl/private/ && mkdir -p /etc/nginx/ssl/cert/
RUN openssl req -x509 -new -newkey rsa:4096 -sha256 -days 3650 -nodes  -keyout /etc/nginx/ssl/private/cert.key -out /etc/nginx/ssl/cert/cert.crt -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:10.21.0.126"
COPY nginx.conf /etc/nginx/nginx.conf
#EXPOSE 3000
ENTRYPOINT ["nginx","-g","daemon off;"]
