import * as PUPPET from 'wechaty-puppet';

import { type DTContactRawPayload } from '../schemas';

export async function dtContactToWechaty(
  _: PUPPET.Puppet,
  payload: DTContactRawPayload,
): Promise<PUPPET.payloads.Contact> {
  const ret: PUPPET.payloads.Contact = {
    id: payload.id,
    avatar: '',
    type: PUPPET.types.Contact.Individual,
    gender: PUPPET.types.ContactGender.Unknown,
    name: payload.name,
    handle: payload.id,
    friend: true,
    phone: [],
  };

  return ret;
}
