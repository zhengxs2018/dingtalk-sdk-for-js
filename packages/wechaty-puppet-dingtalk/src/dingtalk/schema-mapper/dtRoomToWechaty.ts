import * as PUPPET from 'wechaty-puppet';

import { type DTRoomRawPayload } from '../schemas';

export async function dtRoomToWechaty(_: PUPPET.Puppet, payload: DTRoomRawPayload): Promise<PUPPET.payloads.Room> {
  const ret: PUPPET.payloads.Room = {
    id: payload.id,
    topic: payload.topic || '',
    adminIdList: payload.adminIdList || [],
    memberIdList: payload.memberIdList || [],
  };

  return ret;
}
