import './config/env';
import express from 'express';
import router from './routes';
import { connectDatabase, disconnectDatabase } from './database/prisma';

const app = express();
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;

async function startServer(): Promise<void> {
   await connectDatabase();

   const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
   });

   const shutdown = (): void => {
      server.close(() => {
         void disconnectDatabase().finally(() => process.exit(0));
      });
   };

   process.once('SIGINT', shutdown);
   process.once('SIGTERM', shutdown);
}

startServer().catch((error: unknown) => {
   console.error('Failed to start server:', error);
   process.exit(1);
});
