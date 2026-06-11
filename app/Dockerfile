FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY package.json next.config.mjs ./
COPY src ./src

ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION

RUN npm run build

FROM node:24-alpine
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app

# next "standalone" output: server.js + the minimal node_modules it needs
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION

USER node

EXPOSE 3000
CMD ["node", "server.js"]
