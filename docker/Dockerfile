# Dockerfile
# Use the official Node.js image as base
FROM node:14

# Set the working directory inside the container
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install --production

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port that your app runs on
EXPOSE 8080

# Command to run your application
CMD ["node", "index.js"]
