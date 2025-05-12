# Build stage for processing Swagger with examples
FROM node:18-alpine AS swagger-processor

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Install widdershins globally
RUN npm install -g widdershins@4.0.1

# Copy the entire project
COPY . .

# Create output directory
RUN mkdir -p slate-docs/source

# Run widdershins CLI directly
RUN widdershins --search true \
    --language_tabs "python:Python" \
    --theme darkula \
    --maxDepth 10 \
    swagger-spec.json \
    -o slate-docs/source/index.html.md

# Use the official Slate image for building the documentation
FROM slatedocs/slate:latest AS builder

# Copy the logo to the Slate source directory
COPY --from=swagger-processor /app/docs/assets/tensorplex-kami-logo.jpg /srv/slate/source/images/logo.png

# Copy the generated markdown
COPY --from=swagger-processor /app/slate-docs/source/index.html.md /srv/slate/source/index.html.md

# Build the documentation
RUN /srv/slate/slate.sh build

# Production stage using Nginx for serving the static files
FROM nginx:alpine

# Copy the built documentation from the builder stage
COPY --from=builder /srv/slate/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]