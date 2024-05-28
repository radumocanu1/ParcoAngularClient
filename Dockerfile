# Stage 1: Build the Angular app
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --omit=dev

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Șterge conținutul implicit al directorului nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copiază build-ul Angular
COPY --from=build /app/dist/parco-frontend/browser /usr/share/nginx/html

# Setează permisiunile corecte
RUN chmod -R 755 /usr/share/nginx/html

# Copiază configurația nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
