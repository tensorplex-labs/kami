  FROM node:20-alpine AS base
  WORKDIR /app

  RUN apk add --no-cache python3 make g++ git

  FROM base AS dependencies
  COPY package*.json ./
  RUN npm ci

  FROM dependencies AS build
  COPY . .
  RUN npm run build

  # ---- Production ----
  FROM node:20-alpine AS production
  WORKDIR /app

  # copy required files from build stage
  COPY --from=build /app/dist ./dist
  COPY --from=build /app/node_modules ./node_modules
  COPY --from=build /app/package*.json ./

  ENV NODE_ENV=production
  ENV HOME=/home/nestjs

  EXPOSE 3000

  CMD ["node", "dist/main"]

