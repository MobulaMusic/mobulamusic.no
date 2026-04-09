FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENV PORT=8080
EXPOSE 8080
CMD sh -c "sed -i s/__PORT__/$PORT/ /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
