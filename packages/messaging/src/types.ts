export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendResult {
  ok: boolean;
  providerMessageId?: string;
  error?: string;
}

/** Every outbound email channel implements this, so Resend can be swapped later. */
export interface EmailProvider {
  send(message: EmailMessage): Promise<SendResult>;
}
