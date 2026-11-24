import { EmailQuota } from '@triyugi/db';
import { istDateKey } from '@triyugi/shared';

/**
 * Atomically claims one email slot for today (IST).
 * Returns false when the daily limit (Resend free tier) is used up, so the message
 * stays queued and rolls over to the next day.
 */
export async function claimEmailSlot(limit: number): Promise<boolean> {
  const dateKey = istDateKey();

  try {
    await EmailQuota.updateOne(
      { dateKey },
      { $setOnInsert: { sentCount: 0, limit } },
      { upsert: true },
    );
  } catch (err) {
    // Two workers creating today's row at once: ignore the duplicate key error.
    if ((err as { code?: number }).code !== 11000) throw err;
  }

  const claimed = await EmailQuota.findOneAndUpdate(
    { dateKey, $expr: { $lt: ['$sentCount', '$limit'] } },
    { $inc: { sentCount: 1 } },
    { new: true },
  );
  return claimed !== null;
}
