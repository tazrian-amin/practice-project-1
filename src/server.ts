import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';

const { port, database_url } = config;

let server: Server;

async function main() {
  try {
    await mongoose.connect(database_url as string);
    server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log('unhandledRejection is detected! Shutting down the server...');

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('uncaughtException is detected! Shutting down the server...');
  process.exit(1);
});
