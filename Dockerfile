# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install Prisma Client engine dependency first
COPY prisma ./prisma/
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Generate Prisma client
RUN yarn prisma generate

# Copy the rest of the code
COPY . .

# Build the TypeScript app
RUN yarn build

# Expose the port (adjust if needed)
EXPOSE 4000

# Start the app
CMD ["node", "dist/index.js"]
