# ---- deps stage ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- runtime stage ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION

USER node

EXPOSE 3000
CMD ["node", "src/server.js"]
