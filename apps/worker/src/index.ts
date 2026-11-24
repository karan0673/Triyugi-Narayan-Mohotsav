import { connectDb, disconnectDb } from '@triyugi/db';
import { processEmailQueue } from './email-queue';

const POLL_MS = 30_000;

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  const dailyLimit = Number(process.env.EMAIL_DAILY_LIMIT ?? 90);

  await connectDb(uri);
  console.log('[worker] connected to MongoDB');

  // Simple polling loop for now. Later: consume SQS messages triggered by EventBridge Scheduler
  // (daily reminder generation) and keep this loop for email sending.
  const timer = setInterval(async () => {
    try {
      const handled = await processEmailQueue(dailyLimit);
      if (handled > 0) console.log(`[worker] processed ${handled} email message(s)`);
    } catch (err) {
      console.error('[worker] email queue error', err);
    }
  }, POLL_MS);

  const shutdown = async () => {
    clearInterval(timer);
    await disconnectDb();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
