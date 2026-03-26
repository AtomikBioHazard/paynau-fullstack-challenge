FROM node:20-alpine AS dependencies
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/. .
COPY shared/ ./shared/
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package*.json ./
COPY backend/tsconfig.runtime.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
RUN mkdir -p data
EXPOSE 3000
ENV TS_NODE_PROJECT=tsconfig.runtime.json
CMD ["node", "-r", "tsconfig-paths/register", "dist/src/server.js"]
