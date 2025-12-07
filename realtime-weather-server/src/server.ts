#!/usr/bin/env node

import { App } from './app';

const app = new App();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  app.stop();
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  app.stop();
});

// Start the server
app.start();
