# Use a specific version of Node.js as a base
FROM node:14

# Set the working directory inside the container
WORKDIR /index

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json* ./

# List files in the directory to debug the issue
RUN ls -al

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
