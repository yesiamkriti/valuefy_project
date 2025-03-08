# Use an official Node.js image as the base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the entire project
COPY . .

# Install Python dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv ffmpeg && \
    python3 -m venv /venv && \
    /venv/bin/pip install --no-cache-dir -r requirements.txt
    
ENV PORT 5000
# Expose the server port
EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]
