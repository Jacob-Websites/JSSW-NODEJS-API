# syntax=docker/dockerfile:1
   
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod -R 755 node_modules/.bin

CMD ["npx", "nodemon", "index.js"]

EXPOSE 3000
