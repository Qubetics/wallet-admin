# Use official Node.js 18.18.0 image
FROM node:18.18.0-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps to avoid conflict
RUN npm install --legacy-peer-deps

# Copy the rest of your code
COPY . .

# Build the project (if applicable)
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
