# Stage 1: Install production dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


# Stage 2: Production backend
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

# Run application as non-root user
USER node

EXPOSE 5000

CMD ["node", "src/server.js"]