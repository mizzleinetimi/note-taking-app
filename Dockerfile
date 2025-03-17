# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN cd client && npm install && npm run build

# Expose the port the app will run on
EXPOSE 5000

# Create a directory for notes that will persist between container restarts
RUN mkdir -p /app/data

# Set the path for the notes file
ENV NOTES_PATH=/app/data/notes.json

# Initialize the notes file if it doesn't exist
RUN echo "[]" > /app/data/notes.json

# Command to run the application
CMD ["node", "server.js"]