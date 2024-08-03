# syntax=docker/dockerfile:1
   
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod -R 755 node_modules/.bin

# Use npx to run nodemon
CMD ["npx", "nodemon", "index.js"]

# Expose the port the app runs on
EXPOSE 3000
