import { toWaDigits } from '@triyugi/shared';

/** Builds a click-to-chat link. The admin taps it and sends the message in WhatsApp. */
export function buildWaLink(e164Phone: string, text: string): string {
  return `https://wa.me/${toWaDigits(e164Phone)}?text=${encodeURIComponent(text)}`;
}
