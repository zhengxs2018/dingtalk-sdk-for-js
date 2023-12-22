export type DTContactRawPayload = {
  /**
   * 发送者的用户ID
   *
   * @remarks 该字段在机器人发布线上版本后，才会返回。
   */
  staffId?: string;
  /**
   * 发送者所在企业的CorpID
   */
  corpId: string;
  /**
   * 加密的发送者ID
   */
  id: string;
  /**
   * 发送者昵称
   */
  name: string;
  // hack 解决 wechaty 发送消息不会传消息 ID 的问题
  sessionWebhook: string;
  sessionWebhookExpiredTime: number;
};
