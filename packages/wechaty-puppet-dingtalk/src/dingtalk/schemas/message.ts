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
  isInAtList?: boolean;
  atUsers?: Array<{
    dingtalkId: string;
    staffId: string;
  }>;

  sessionWebhook: string;
  sessionWebhookExpiredTime: number;
}

export interface DTTextMessageRawPayload extends DTMessageRawPayloadBase {
  msgtype: 'text';
  text: { content: string };
}

export interface DTFileMessageRawPayload extends DTMessageRawPayloadBase {
  msgtype: 'file';
  content: {
    downloadCode: string;
    fileName: string;
  };
}

export interface DTRichTextMessageRawPayload extends DTMessageRawPayloadBase {
  msgtype: 'richText';
  content: {
    richText: DTRichSection[];
  };
}

export type DTRichSection = DTRichSection.Picture | DTRichSection.Text;

export namespace DTRichSection {
  export type Text = {
    text: string;
  };

  export type Picture = {
    downloadCode: string;
    type: 'picture';
  };
}

export interface DTVideoMessageRawPayload extends DTMessageRawPayloadBase {
  msgtype: 'video';
  content: {
    duration: number;
    downloadCode: string;
    videoType: string; // eq. mp4
  };
}

export interface DTPictureMessageRawPayload extends DTMessageRawPayloadBase {
  msgtype: 'picture';
  content: {
    downloadCode: string;
  };
}

export interface DTAudioMessageRawPayload extends DTMessageRawPayloadBase {
  msgtype: 'audio';
  content: {
    duration: number;
    downloadCode: string;
    recognition: string;
  };
}

// See https://open.dingtalk.com/document/orgapp/receive-message
export type DTMessageRawPayload =
  | DTTextMessageRawPayload
  | DTRichTextMessageRawPayload
  | DTFileMessageRawPayload
  | DTAudioMessageRawPayload
  | DTVideoMessageRawPayload
  | DTPictureMessageRawPayload;

export enum DTMessageType {
  Text = 'text',
  RichText = 'richText',
  File = 'file',
  Audio = 'audio',
  Video = 'video',
  Image = 'picture',
}
