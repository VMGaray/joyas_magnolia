# Multi-stage build
FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /app/dist ./dist


# Create temp-uploads directory with proper permissions
RUN mkdir -p temp-uploads && chmod 777 temp-uploads

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 4000

CMD ["sh", "-c", "npm run migration:run:prod && node dist/main"]