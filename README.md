# Cracy - PDE Platform

## Technology Stack

**Backend**

- Nestjs
- Prisma
- Typescript

**Frontend**

- Vue-typescript
- TailwindCSS (css library)
- Pinia (State management)

## Installation

### Local Development

#### Dependencies

**Docker**

Docker is also required for local development. Make sure you have Docker installed and running on your machine.

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### Auto install

Copy the environment files and add the correct environment values (**ask your technical lead for these secrets**)

```bash
cp ./apps/api/.env.example ./apps/api/.env
cp ./apps/web/.env.example ./apps/web/.env

```

Create .env file in root

```bash
#Database
DATABASE_URL=mysql://root:root@localhost:3306/cracy-db?schema=public

```

```bash
yarn # install all dependencies

# or run only the services/mocks you need
docker compose -f docker-compose.development.yml up -d

yarn prisma migrate dev

yarn seed

yarn build

yarn dev
```

#### Swagger Api docs

The swagger api docs can locally be found at: [http://localhost:4000/docs](http://localhost:4000/docs)
