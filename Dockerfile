# Node.js 20 lightweight Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package dependency definitions
COPY package*.json ./

# Install production dependencies cleanly
RUN npm ci --omit=dev

# Copy the rest of the application files
COPY . .

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port (default 5000)
EXPOSE 5000

# Run as non-root user for security
USER node

# Start the application
CMD ["npm", "start"]

