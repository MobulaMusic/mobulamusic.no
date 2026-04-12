FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

# Only production deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Built server + seed content + startup script
COPY --from=build /app/dist ./dist
COPY --from=build /app/seed ./seed
COPY --from=build /app/scripts ./scripts

EXPOSE 8080
CMD ["npm", "run", "start"]
