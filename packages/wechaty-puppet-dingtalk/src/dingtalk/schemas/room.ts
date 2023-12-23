import * as PUPPET from 'wechaty-puppet';

export interface DTRoomRawPayload extends PUPPET.payloads.Room {
  /**
   * Webhook 地址
   *
   * @remarks 方便自定义管理后台调用
   */
  sessionWebhook: string;

  /**
   * 过期时间
   */
  sessionWebhookExpiredTime: number;
}
