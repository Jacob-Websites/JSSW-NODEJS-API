# Use a specific version of Node.js as a base to avoid compatibility issues
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clear npm cache and install dependencies with verbose logging to help diagnose issues
RUN npm cache clean --force \
    && npm install --verbose

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
