FROM node:20-alpine as build

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app

RUN npm run ng build

RUN ls -a ./dist/dashboard

FROM nginx:alpine

COPY --from=build /app/dist/dashboard/browser /usr/share/nginx/html

RUN ls -a /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
