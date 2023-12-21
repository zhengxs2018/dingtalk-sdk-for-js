export type DTRoomRawPayload = {
  conversationId: string;
  conversationTitle?: string;
  // hack 解决 wechaty 发送消息不会传消息 ID 的问题
  sessionWebhook: string;
  sessionWebhookExpiredTime: number;
};
