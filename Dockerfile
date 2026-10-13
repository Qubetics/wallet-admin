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
# Unprivileged nginx: runs as uid 101 and listens on 8080, so it starts under
# restricted pod security contexts (runAsNonRoot / dropped capabilities)
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
