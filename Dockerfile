# syntax=docker/dockerfile:1
   
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm install nodemon
CMD ["npx","nodemon", "index.js"]
EXPOSE 3000