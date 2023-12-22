import { APIResource } from '../../resource';
import * as MessagesAPI from './messages';

export class Robots extends APIResource {
  messages: MessagesAPI.Messages = new MessagesAPI.Messages(this._client);
}

export namespace Robots {
  export type Messages = MessagesAPI.Messages;
  export type MessageFile = MessagesAPI.MessageFile;
}
