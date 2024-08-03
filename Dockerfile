# syntax=docker/dockerfile:1
   
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["nodemon", "index.js"]
EXPOSE 3000