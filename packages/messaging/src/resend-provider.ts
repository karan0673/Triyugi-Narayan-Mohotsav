import { Resend } from 'resend';
import type { EmailMessage, EmailProvider, SendResult } from './types';

export class ResendEmailProvider implements EmailProvider {
  private client: Resend;

  constructor(
    apiKey: string,
    private readonly from: string,
  ) {
    this.client = new Resend(apiKey);
  }

  async send(message: EmailMessage): Promise<SendResult> {
    const { data, error } = await this.client.emails.send({
      from: this.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, providerMessageId: data?.id };
  }
}
