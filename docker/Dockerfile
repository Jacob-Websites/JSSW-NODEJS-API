# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:20

# Create and change to the app directory.
WORKDIR /index

# Copy application dependency manifests to the container image.
COPY package.json /index
RUN npm install --production


# Debug step: List files after copying package*.json
RUN ls -alh index

# Install production dependencies.
RUN npm install --production

# Copy local code to the container image.
COPY . /index


# Run the web service on container startup.
CMD [ "node", "index.js" ]

# Document that the service listens on port 8080.
EXPOSE 8080
