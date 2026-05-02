FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5173

# Dev mode with HMR — Vite handles WebSocket client connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]