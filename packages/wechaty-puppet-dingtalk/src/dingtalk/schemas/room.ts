import { type DTContactRawPayload } from './contact';

export type DTRoomRawPayload = {
  conversationId: string;
  conversationTitle?: string;

  // TODO 临时方案，解决钉钉群成员列表获取不到的问题
  memberList: DTContactRawPayload[];

  // hack 解决 wechaty 发送消息不会传消息 ID 的问题
  sessionWebhook: string;
  sessionWebhookExpiredTime: number;
};
