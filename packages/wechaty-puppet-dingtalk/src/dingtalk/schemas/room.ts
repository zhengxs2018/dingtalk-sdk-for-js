import { type DTContactRawPayload } from './contact';
import { type DTSessionWebhookRawPayload } from './webhook';

export interface DTRoomRawPayload extends DTSessionWebhookRawPayload {
  conversationId: string;
  conversationTitle?: string;
  // TODO 临时方案，解决钉钉群成员列表获取不到的问题
  memberList: DTContactRawPayload[];
}
