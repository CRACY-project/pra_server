FROM node:22-alpine as builder
WORKDIR /app
RUN corepack enable yarn
RUN yarn global add turbo 
COPY . .
RUN turbo prune --scope="@cracy/api" --docker


# Add lockfile and package.json's of isolated subworkspace
FROM node:22-alpine AS installer
WORKDIR /app
RUN corepack enable yarn
RUN yarn global add prisma turbo openssl patch-package
RUN apk add --no-cache curl
# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install --frozen-lockfile
# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
ENV JWT_ACCESS_TOKEN_SECRET=secretkey
ENV JWT_REFRESH_TOKEN_SECRET=secretkey
ENV DATABASE_URL=mysql://placeholder:placeholder@placeholder:3306/development-db?schema=public
ENV NODE_ENV=production
RUN turbo run build --filter="@cracy/api" --env-mode=loose
RUN yarn install --frozen-lockfile

FROM node:22-alpine as production
USER root
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache bash
RUN npm install pm2 prisma -g

COPY --from=installer /app .

RUN chmod +x /app/apps/api/start.sh
RUN chmod +x /app/apps/api/wait-for-it.sh
WORKDIR /app/apps/api
CMD ["./start.sh"]
