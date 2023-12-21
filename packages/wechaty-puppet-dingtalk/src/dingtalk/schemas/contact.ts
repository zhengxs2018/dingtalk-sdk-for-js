export type DTContactRawPayload = {
  senderId: string;
  senderNick: string;
  senderStaffId: string;
  senderCorpId: string;
  isAdmin: boolean;
  // hack 解决 wechaty 发送消息不会传消息 ID 的问题
  sessionWebhook: string;
  sessionWebhookExpiredTime: number;
};
