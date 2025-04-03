FROM node:18-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

ARG REACT_APP_IDENTITY_CLIENT_ID
ARG REACT_APP_PUBLIC_URL
ARG REACT_APP_AUTH_URL
ARG REACT_APP_REDIRECT_URL
ARG REACT_APP_API_HOST
ARG REACT_APP_API_TOKEN
ARG REACT_APP_APIM_TOKEN_URL
ARG REACT_APP_APIM_CONSUMER_KEY
ARG REACT_APP_APIM_CONSUMER_SECRET
ARG REACT_APP_IDENTITY_CLIENT_SECRET


# Copia package.json e instala dependências
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copia o código-fonte e constrói a aplicação
COPY . .


ENV REACT_APP_PUBLIC_URL $REACT_APP_PUBLIC_URL
ENV REACT_APP_AUTH_URL $REACT_APP_AUTH_URL
ENV REACT_APP_REDIRECT_URL $REACT_APP_REDIRECT_URL
ENV REACT_APP_API_HOST $REACT_APP_API_HOST
ENV REACT_APP_IDENTITY_CLIENT_ID $REACT_APP_IDENTITY_CLIENT_ID
ENV REACT_APP_API_TOKEN $REACT_APP_API_TOKEN
ENV REACT_APP_APIM_TOKEN_URL $REACT_APP_APIM_TOKEN_URL
ENV REACT_APP_APIM_CONSUMER_KEY $REACT_APP_APIM_CONSUMER_KEY
ENV REACT_APP_APIM_CONSUMER_SECRET $REACT_APP_APIM_CONSUMER_SECRET
ENV REACT_APP_IDENTITY_CLIENT_SECRET $REACT_APP_IDENTITY_CLIENT_SECRET

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
