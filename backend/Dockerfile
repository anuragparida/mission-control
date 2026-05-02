FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm install --omit=dev \
    express cors ws better-sqlite3 chokidar
COPY dist ./dist

EXPOSE 18792

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:18792/api/status || exit 1

CMD ["node", "dist/index.js"]