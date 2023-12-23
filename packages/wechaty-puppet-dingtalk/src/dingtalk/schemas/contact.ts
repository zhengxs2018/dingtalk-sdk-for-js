export enum DTContactType {
  Robot = 1,
  User = 2,
}

export interface DTContactRawPayload {
  /**
   * 加密的发送者ID
   */
  id: string;

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
   * 发送者昵称
   */
  name: string;

  /**
   * 发送者头像
   */
  avatar: string;

  /**
   * 用户类型
   */
  type: DTContactType;

  /**
   * Webhook 地址
   *
   * @remarks 方便自定义管理后台调用
   */
  sessionWebhook: string;

  /**
   * Webhook 过期时间
   */
  sessionWebhookExpiredTime: number;
}
