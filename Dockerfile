# Use official Node.js 18.18.0 image
FROM node:18.18.0-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app files
COPY . .

# Build the frontend (optional - if using a build step)
RUN npm run build

# Expose port (change as needed, e.g. 3000 or 80)
EXPOSE 3000

# Start the frontend app
CMD ["npm", "start"]
