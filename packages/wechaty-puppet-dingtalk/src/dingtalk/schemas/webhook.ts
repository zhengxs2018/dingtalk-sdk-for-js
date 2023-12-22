// hack 解决 wechaty 发送消息不会传消息 ID 的问题
export interface DTSessionWebhookRawPayload {
  sessionWebhook: string;
  sessionWebhookExpiredTime: number;
}
