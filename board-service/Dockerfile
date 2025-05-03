# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to the container
COPY package.json package-lock.json* ./

# Install the dependencies inside the container
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your app will run on inside the container
EXPOSE 3000

# Command to run your app
# CMD ["node", "src/server.js"]
CMD ["npm", "run", "dev"]

