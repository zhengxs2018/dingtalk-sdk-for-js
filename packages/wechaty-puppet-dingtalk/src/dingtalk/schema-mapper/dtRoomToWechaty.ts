import * as PUPPET from 'wechaty-puppet';

import { type DTRoomRawPayload } from '../schemas';

export async function dtRoomToWechaty(_: PUPPET.Puppet, payload: DTRoomRawPayload): Promise<PUPPET.payloads.Room> {
  const ret: PUPPET.payloads.Room = {
    id: payload.conversationId,
    topic: payload.conversationTitle || '',
    adminIdList: [],
    memberIdList: [],
  };

  return ret;
}
