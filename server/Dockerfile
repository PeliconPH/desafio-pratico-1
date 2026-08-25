# ---- build ----
FROM node:22-slim AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# ---- runtime ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# instala apenas deps de produção
COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

# artefatos de build + migrations
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/db/migrations ./src/db/migrations

# usuário não-root
USER node

EXPOSE 3333
CMD ["node", "dist/server.js"]
