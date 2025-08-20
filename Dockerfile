FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the app's port
EXPOSE ${PORT}

# Run with ts-node-dev in dev mode
CMD ["npm", "run", "dev"]
