#STAGE 1
FROM node:20.16.0-alpine AS BUILD_IMAGE

COPY .env .

WORKDIR /frontend
COPY . .
RUN npm install
RUN npm run build

#STAGE 2
FROM nginx:alpine

COPY nginx-setup.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www/frontend

COPY --from=BUILD_IMAGE /frontend/dist .

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]