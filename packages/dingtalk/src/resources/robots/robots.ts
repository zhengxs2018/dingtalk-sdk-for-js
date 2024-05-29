import { APIResource } from '../../resource';
import * as InteractiveCardsAPI from './interactive-cards';
import * as MessagesAPI from './messages';

export class Robots extends APIResource {
  messages: MessagesAPI.Messages = new MessagesAPI.Messages(this._client);
  interactiveCards: InteractiveCardsAPI.InteractiveCards = new InteractiveCardsAPI.InteractiveCards(this._client);
}

export namespace Robots {
  export import Messages = MessagesAPI.Messages;
  export type MessageFile = MessagesAPI.MessageFile;
  export import InteractiveCards = InteractiveCardsAPI.InteractiveCards;
}
