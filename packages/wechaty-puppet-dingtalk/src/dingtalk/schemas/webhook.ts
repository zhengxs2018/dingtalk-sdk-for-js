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

  /**
   * 机器人ID
   */
  chatbotUserId: string;

  /**
   * 会话ID
   */
  conversationId: string;

  /**
   * Webhook 地址
   */
  sessionWebhook: string;

  /**
   * 过期时间
   */
  sessionWebhookExpiredTime: number;
}
