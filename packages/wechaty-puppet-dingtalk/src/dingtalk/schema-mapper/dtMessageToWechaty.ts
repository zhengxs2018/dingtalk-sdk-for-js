import * as PUPPET from 'wechaty-puppet';

import { type DTMessageRawPayload, DTMessageType } from '../schemas';

export async function dtMessageToWechaty(
  _: PUPPET.Puppet,
  payload: DTMessageRawPayload,
): Promise<PUPPET.payloads.Message> {
  const ret: PUPPET.payloads.Message = {
    id: payload.msgId,
    talkerId: payload.senderId,
    text: undefined,
    timestamp: payload.createAt,
    listenerId: payload.senderId,
    type: PUPPET.types.Message.Unknown,
  } as PUPPET.payloads.Message;

  if (payload.conversationType === '2') {
    ret.roomId = payload.conversationId;
    // @ts-expect-error
    ret.mentionIdList = payload.atUsers?.map(u => u.dingtalkId) || [];
  }

  // TODO: support more msgtype
  switch (payload.msgtype) {
    case DTMessageType.Text:
      ret.text = payload.text.content;
      ret.type = PUPPET.types.Message.Text;
      break;
  }

  return ret;
}
