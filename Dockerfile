# Matches .nvmrc (24.22.1)
FROM node:24.22-slim

# Environment variables
ENV DEBIAN_FRONTEND=noninteractive \
    npm_config_cache=/tmp/.npm

# Update software list
RUN apt-get update && \
    apt-get install -y curl procps && \
    # Clean npm cache AS ROOT before switching user
    npm cache clean --force && \
    mkdir -p "$npm_config_cache" && \
    chown -R node:node "$npm_config_cache" && \
    # Create the app directory while still root so the node user owns it
    mkdir -p /home/node/app && \
    chown -R node:node /home/node/app && \
    # Clean up apt cache to reduce image size
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user
USER node

# Set working directory with correct permissions
WORKDIR /home/node/app

# Vite dev server and preview server
EXPOSE 5173 4173

CMD ["sleep", "infinity"]
