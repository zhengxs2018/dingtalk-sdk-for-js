/**
 * 特殊的 Webhook 会话
 */
export interface DTSessionWebhookRawPayload {
  /**
   * 消息ID
   */
  msgId: string;

  /**
   * 发送者ID
   */
  senderId: string;

  /***
   * 发送者的员工ID
   */
  senderStaffId?: string;

  /**
   * 机器人ID
   */
  chatbotUserId: string;

  /**
   * 机器人编码
   */
  robotCode: string;

  /**
   * 会话ID
   */
  conversationId: string;

  /**
   * 会话类型
   */
  conversationType: '1' | '2';

  /**
   * Webhook 地址
   */
  sessionWebhook: string;

  /**
   * 过期时间
   */
  sessionWebhookExpiredTime: number;
}
