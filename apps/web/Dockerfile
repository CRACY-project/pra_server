FROM node:22-bullseye AS builder
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk ca-certificates-java jq && \
    apt-get clean && \
    update-ca-certificates -f
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64/
RUN export JAVA_HOME
ARG JWT_ACCESS_TOKEN_SECRET=secretkey
ARG JWT_REFRESH_TOKEN_SECRET=secretkey
ARG DATABASE_URL=mysql://placeholder:placeholder@placeholder:3306/development-db?schema=public
ARG VITE_AZURE_AUTH_AUDIENCE=placeholder
ARG VITE_GOOGLE_AUTH_CLIENT_ID=placeholder
WORKDIR /app
RUN corepack enable yarn
RUN yarn global add turbo
RUN yarn global add node-gyp
RUN yarn global add patch-package
COPY . .
RUN jq '.["generator-cli"].useDocker = false' packages/typescript-client/openapitools.json > temp.json && mv temp.json packages/typescript-client/openapitools.json
RUN yarn install --frozen-lockfile
RUN turbo run build --filter="@cracy/web" --env-mode=loose
WORKDIR /app/apps/web

FROM nginx:latest
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
