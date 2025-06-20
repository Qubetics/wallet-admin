# Use official Node.js 18.18.0 image
FROM node:18.20.8

# Set working directory
WORKDIR /app

# Copy package files and patches
COPY package*.json ./

COPY patches ./patches

# Install dependencies with legacy peer deps to avoid conflict
RUN npm install --force

# Copy the rest of your code
COPY . .

# Build the project (if applicable)
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 80

# Start the app
CMD ["npm", "start"]
