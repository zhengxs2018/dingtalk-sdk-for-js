import type { DTContactRawPayload } from './contact';

export interface DTMessageRawPayloadBase extends DTContactRawPayload {
  conversationId: string;
  conversationType: '2' | '1';
  conversationTitle?: string;

  robotCode: string;
  chatbotCorpId: string;
  chatbotUserId: string;

  msgId: string;
  msgtype: string;
  createAt: number;

  sessionWebhook: string;
  sessionWebhookExpiredTime: number;
}

export interface DTTextMessageRawPayload extends DTMessageRawPayloadBase {
  msgtype: 'text';
  text: { content: string };
}

export interface DTMarkdownMessageRawPayload extends DTMessageRawPayloadBase {
  msgtype: 'markdown';
  markdown: {
    text: string;
    title: string;
  };
}

export type DTMessageRawPayload =
  | DTTextMessageRawPayload
  | DTMarkdownMessageRawPayload;

export enum DTMessageType {
  Text = 'text',
  Markdown = 'markdown',
}
