# Use official Node.js image as the base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the React app
RUN npm run build

# Install and use serve to serve the built app
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Start the frontend
CMD ["serve", "-s", "build", "-l", "3000"]
