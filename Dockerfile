FROM node:20-alpine

WORKDIR /app

# Install dependencies and cloudflared
RUN apk add --no-cache curl bash wget && \
    curl -L --output /usr/local/bin/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 && \
    chmod +x /usr/local/bin/cloudflared

# Copy package.json and install Node modules
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source files
COPY . .

# Build the Astro app
RUN npm run build

# Make the start script executable
RUN chmod +x start.sh

# Hugging Face requires the container to listen on port 7860
EXPOSE 7860

CMD ["./start.sh"]
