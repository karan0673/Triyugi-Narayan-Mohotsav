import { Message } from '@triyugi/db';
import { claimEmailSlot } from './quota';

const BATCH_SIZE = 20;

/**
 * Sends queued email messages in priority order while today's quota allows.
 * TODO (Phase 2): render with React Email, send through ResendEmailProvider,
 * then mark the message and the guest's emailDelivery status.
 */
export async function processEmailQueue(dailyLimit: number): Promise<number> {
  const due = await Message.find({
    channel: 'email',
    status: 'queued',
    scheduledFor: { $lte: new Date() },
  })
    .sort({ priority: 1, scheduledFor: 1 })
    .limit(BATCH_SIZE);

  let handled = 0;
  for (const message of due) {
    const hasSlot = await claimEmailSlot(dailyLimit);
    if (!hasSlot) break; // limit reached: remaining messages stay queued for tomorrow

    // TODO: send the email here, then update status to 'sent' (or 'failed' with lastError).
    handled += 1;
    void message;
  }
  return handled;
}
