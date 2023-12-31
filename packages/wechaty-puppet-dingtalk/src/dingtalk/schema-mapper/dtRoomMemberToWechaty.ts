import * as PUPPET from 'wechaty-puppet';

import { type DTContactRawPayload } from '../schemas';

export function dtRoomMemberToWechaty(rawPayload: DTContactRawPayload): PUPPET.payloads.RoomMember {
  const payload: PUPPET.payloads.RoomMember = {
    avatar: '',
    id: rawPayload.id,
    name: rawPayload.name,
  };

  return payload;
}
