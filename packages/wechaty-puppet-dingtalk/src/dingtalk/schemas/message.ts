/**
 * 机器人消息格式
 *
 * - [机器人接收消息](https://open.dingtalk.com/document/orgapp/receive-message)
 * - [机器人发送消息的类型](https://open.dingtalk.com/document/orgapp/types-of-messages-sent-by-robots)
 */
export interface DTMessageRawPayloadBase {
  /**
   * 会话 ID
   */
  conversationId: string;
  /**
   * 对话类型
   *
   * 1: 单聊
   * 2: 群聊
   */
  conversationType: '1' | '2';
  /**
   * 对话标题，只有群聊才有
   */
  conversationTitle?: string;

  /**
   * 	加密的消息ID
   */
  msgId: string;
  /**
   * 消息类型
   */
  msgtype: string;
  /**
   * 消息的时间戳，单位毫秒
   */
  createAt: number;

  /**
   * 机器人代码
   */
  robotCode: string;
  /**
   * 加密的机器人ID
   */
  chatbotUserId: string;
  /**
   * 机器人所在的企业 CorpId
   */
  chatbotCorpId: string;

  /**
   * 发送者的企业 CorpId
   */
  senderCorpId: string;

  /**
   * 加密的发送者ID
   */
  senderId: string;

  /**
   * 发送者昵称
   */
  senderNick: string;

  /**
   * 发送者在企业内的用户ID
   */
  senderStaffId?: string;

  /**
   * 是否管理员
   */
  isAdmin: boolean;
  /**
   * 是否被提及
   */
  isInAtList?: boolean;
  /**
   * 被提及的用户列表
   */
  atUsers?: Array<{
    /**
     * 加密的发送者ID
     */
    dingtalkId: string;
    /**
     * 企业内部群有的发送者在企业内的用户ID
     *
     * @remarks 该字段在机器人发布线上版本后，才会返回。
     */
    staffId?: string;
  }>;

  /**
   * 当前会话的Webhook地址
   */
  sessionWebhook: string;

  /**
   * 当前会话的 Webhook 地址过期时间
   */
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
