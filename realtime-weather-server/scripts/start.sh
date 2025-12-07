#!/bin/bash

# Build the application
echo "Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed!"
  exit 1
fi

echo "Build successful!"

# Start the server
echo "Starting server..."
npm start
