import {
  type MarkdownMessagePayload,
  type MessagePayload,
  MessageType,
  type Sayable,
  type TextMessagePayload,
} from './payloads';
import { Sender } from './sender';

export class SayableSayer extends Sender {
  async say(sayable: Sayable): Promise<any>;
  async say(sayable: Sayable, atAll: true): Promise<any>;
  async say(sayable: Sayable, mentionIdList: string[]): Promise<any>;
  async say(sayable: Sayable, mentionIdList?: true | string[]): Promise<any> {
    const message = await this.resolve(sayable);

    if (mentionIdList) {
      this.mention(message, mentionIdList);
    }

    return this.send(message);
  }

  protected mention(message: MessagePayload, mentionIdList: true | string[]): void {
    switch (message.msgtype) {
      case MessageType.Text:
      case MessageType.Markdown:
        if (mentionIdList === true) {
          message.at = { isAtAll: true };
        } else if (mentionIdList.length > 0) {
          this.atUserIds(message, mentionIdList);
        }
        break;
    }
  }

  protected atUserIds(message: MarkdownMessagePayload | TextMessagePayload, mentionIdList: string[]): void {
    const mentionText = mentionIdList.map(id => `@${id}`).join(' ');

    message.at = {
      atUserIds: mentionIdList,
    };

    switch (message.msgtype) {
      case MessageType.Markdown: {
        message.markdown.text += ` \n\n------\n\n ###### 此消息通知对象: ${mentionText}`;
        break;
      }
    }
  }

  // TODO 支持媒体消息，并且自动上传
  protected async resolve(sayable: Sayable): Promise<MessagePayload> {
    if (typeof sayable === 'string') {
      return {
        msgtype: MessageType.Text,
        text: {
          content: sayable,
        },
      };
    }

    return sayable;
  }
}
