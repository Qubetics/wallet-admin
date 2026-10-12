# Build stage
FROM node:18.20.8 AS build

WORKDIR /app

# Copy package files and patches (postinstall applies patches/react-scripts patch)
COPY package*.json ./
COPY patches ./patches

# --force is needed because some dependencies have conflicting peer ranges
RUN npm install --force

# Copy the rest of the code. .env.production must exist here at build time,
# because REACT_APP_* values are embedded in the bundle.
COPY . .
RUN npm run build

# Serve stage
FROM nginx:1.27-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
