import app from './app.js';
import config from './config/index.js';
import prisma from './lib/prisma.js';

const PORT = config.port;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    const server = app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      console.error('Server error:', err);
      process.exit(1);
    });

    async function shutdown(signal: string) {
      console.log(`${signal} received, shutting down...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Server closed');
        process.exit(0);
      });
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10_000);
    }

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

main();
