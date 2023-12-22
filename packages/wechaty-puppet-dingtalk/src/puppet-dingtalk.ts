import { extname } from 'node:path';

import { Dingtalk } from '@zhengxs/dingtalk';
import { AuthCredential } from '@zhengxs/dingtalk-auth';
import { type HubConnection, HubConnectionBuilder } from '@zhengxs/dingtalk-event-hubs';
import { toFile } from '@zhengxs/http';
import { FileBox, type FileBoxInterface } from 'file-box';
import { GError } from 'gerror';
import * as PUPPET from 'wechaty-puppet';
import { log } from 'wechaty-puppet';

import { type DTMediaMessageRawPayload, type Sayable, SayableSayer } from './dingtalk';
import {
  type DTContactRawPayload,
  dtContactToWechaty,
  type DTMessageRawPayload,
  dtMessageToWechaty,
  DTMessageType,
  dtRoomMemberToWechaty,
  type DTRoomRawPayload,
  dtRoomToWechaty,
  type MessagePayload,
} from './dingtalk';

export interface PuppetDingTalkOptions extends PUPPET.PuppetOptions {
  clientId?: string;
  clientSecret?: string;
  credential?: AuthCredential;
}

const AttachmentExtRE = /\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf|rar)$/i;
const AudioExtRE = /\.(mp3|wav|wma|ogg|aac|flac)$/i;
const VideoExtRE = /\.(mp4|mov|avi|rmvb|mkv|flv|rm|asf|3gp|wmv|mpeg|dat|mpg|ts|mts|vob)$/i;
const ImageExtRE = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;

export class PuppetDingTalk extends PUPPET.Puppet {
  protected client: Dingtalk;
  protected credential: AuthCredential;
  protected connection?: HubConnection;

  // TODO 使用 keyv 存储方案
  protected contacts = new Map<string, DTContactRawPayload>();

  // TODO 使用 keyv 存储方案
  protected messages = new Map<string, DTMessageRawPayload>();

  // TODO 使用 keyv 存储方案
  protected rooms = new Map<string, DTRoomRawPayload>();

  constructor(options: PuppetDingTalkOptions = {}) {
    const {
      clientId = process.env.DINGTALK_CLIENT_ID,
      clientSecret = process.env.DINGTALK_CLIENT_SECRET,
      credential = new AuthCredential({ clientId, clientSecret }),
      ...rest
    } = options;

    super(rest);

    this.credential = credential;
    this.client = new Dingtalk({ credential });
  }

  override async roomRawPayload(roomId: string): Promise<DTRoomRawPayload> {
    const rooms = this.rooms;

    log.verbose('PuppetDingTalk', 'contactRawPayload(%s) with rooms.length=%d', roomId, rooms.size);

    const rawPayload = rooms.get(roomId);

    if (!rawPayload) {
      throw new Error(`Room ${roomId} not found`);
    }

    return rawPayload;
  }

  override async roomRawPayloadParser(rawPayload: DTRoomRawPayload): Promise<PUPPET.payloads.Room> {
    return dtRoomToWechaty(this, rawPayload);
  }

  override async roomMemberList(roomId: string): Promise<string[]> {
    log.verbose('PuppetDingTalk', 'roomMemberList(%s)', roomId);

    const rawPayload = await this.roomRawPayload(roomId);

    const memberIdList = rawPayload.memberList.map(member => member.id);

    return memberIdList;
  }

  override async roomMemberRawPayload(roomId: string, contactId: string): Promise<DTContactRawPayload> {
    log.verbose('PuppetDingTalk', 'roomMemberRawPayload(%s, %s)', roomId, contactId);
    const rawPayload = await this.roomRawPayload(roomId);

    const memberPayloadList = rawPayload.memberList || [];
    const memberPayloadResult = memberPayloadList.find(payload => payload.id === contactId);

    if (memberPayloadResult) {
      return memberPayloadResult;
    } else {
      throw new Error('not found');
    }
  }

  override async roomMemberRawPayloadParser(rawPayload: DTContactRawPayload): Promise<PUPPET.payloads.RoomMember> {
    return dtRoomMemberToWechaty(rawPayload);
  }

  override async contactRawPayload(contactId: string): Promise<DTContactRawPayload> {
    const contacts = this.contacts;

    log.verbose('PuppetDingTalk', 'contactRawPayload(%s) with contacts.length=%d', contactId, contacts.size);

    const rawPayload = contacts.get(contactId);

    if (!rawPayload) {
      throw new Error(`Contacts ${contactId} not found`);
    }

    return rawPayload;
  }

  override async contactRawPayloadParser(rawPayload: DTContactRawPayload): Promise<PUPPET.payloads.Contact> {
    return dtContactToWechaty(this, rawPayload);
  }

  override async messageRawPayload(messageId: string): Promise<DTMessageRawPayload> {
    const messages = this.messages;

    log.verbose('PuppetDingTalk', 'messageRawPayload(%s) with messages.length=%d', messageId, messages.size);

    const rawPayload = messages.get(messageId);

    if (!rawPayload) {
      throw new Error(`Message ${messageId} not found`);
    }

    return rawPayload;
  }

  override async messageRawPayloadParser(rawPayload: DTMessageRawPayload): Promise<PUPPET.payloads.Message> {
    log.verbose('PuppetDingTalk', 'messageRawPayloadParser(%s) @ %s', rawPayload, this);

    return dtMessageToWechaty(this, rawPayload);
  }

  override messageSendText(
    conversationId: string, // TODO 群或联系人ID?
    content: string,
    mentionIdList?: string[],
  ): Promise<void> {
    log.verbose('PuppetDingTalk', 'messageSend(%s, %s)', conversationId, content);

    return this.unstable__say(conversationId, content, mentionIdList || []);
  }

  override async messageSendUrl(conversationId: string, urlLinkPayload: PUPPET.payloads.UrlLink | MessagePayload) {
    log.verbose('PuppetDingTalk', 'messageSendUrl(%s, %s)', conversationId, urlLinkPayload);

    if ('msgtype' in urlLinkPayload) {
      return this.unstable__say(conversationId, urlLinkPayload);
    }

    return this.unstable__say(conversationId, {
      msgtype: 'link',
      link: {
        title: urlLinkPayload.title,
        text: urlLinkPayload.description || '',
        messageUrl: urlLinkPayload.url,
        picUrl: urlLinkPayload.thumbnailUrl || '',
      },
    });
  }

  override async messageSendFile(conversationId: string, fileBox: FileBoxInterface): Promise<void> {
    log.verbose('PuppetDingTalk', 'messageSendFile(%s, %s)', conversationId, fileBox);

    const ext = extname(fileBox.name);

    const files = this.client.files;

    // TODO 图片需要远程地址？
    switch (true) {
      case AttachmentExtRE.test(ext): {
        const fileObj = await files.create({
          type: 'file',
          media: await toFile(fileBox.toStream(), fileBox.name),
        });

        await this.unstable__say(conversationId, {
          msgtype: 'file',
          file: {
            mediaId: fileObj.media_id,
            fileName: fileBox.name,
            fileType: ext.slice(1),
          },
        });
        break;
      }

      case AudioExtRE.test(ext): {
        throw new Error(`暂不支持语音文件的发送`);
      }

      case VideoExtRE.test(ext): {
        throw new Error(`暂不支持视频文件的发送`);
      }

      case ImageExtRE.test(ext): {
        throw new Error(`暂不支持图片的发送`);
        break;
      }

      default:
        throw new Error(`unknown file type: ${fileBox.name}`);
    }
  }

  override async messageImage(messageId: string, imageType: PUPPET.types.Image): Promise<FileBoxInterface> {
    log.verbose('PuppetDingTalk', 'messageImage(%s, %s[%s])', messageId, imageType, PUPPET.types.Image[imageType]);

    const payload = await this.messageRawPayload(messageId);

    return this.unstable_downloadFile(payload.robotCode, (payload as DTMediaMessageRawPayload).content.downloadCode);
  }

  override async messageFile(messageId: string): Promise<FileBoxInterface> {
    log.verbose('PuppetDingTalk', 'messageFile(%s)', messageId);

    const payload = await this.messageRawPayload(messageId);

    switch (payload.msgtype) {
      case DTMessageType.File:
      case DTMessageType.Video:
      case DTMessageType.Audio:
      case DTMessageType.Image:
        return this.unstable_downloadFile(payload.robotCode, payload.content.downloadCode);
      default:
        throw new Error(`unknown msgtype: ${payload.msgtype}`);
    }
  }

  override async onStart(): Promise<void> {
    log.verbose('PuppetDingTalk', 'onStart() with %s', this.memory.name || 'NONAME');

    const connection = new HubConnectionBuilder().withCredential(this.credential).build();

    const rooms = this.rooms;
    const contacts = this.contacts;
    const messages = this.messages;

    connection.on('message', async event => {
      const payload: DTMessageRawPayload = JSON.parse(event.data);

      const { sessionWebhook, sessionWebhookExpiredTime } = payload;

      const chatbotUser: DTContactRawPayload = {
        id: payload.chatbotUserId,
        corpId: payload.chatbotCorpId,
        staffId: payload.robotCode,
        name: `🤖️ 默认`,
        // hack 解决 wechaty 发送消息不会传消息 ID 的问题
        sessionWebhook,
        sessionWebhookExpiredTime,
      };

      contacts.set(chatbotUser.id, chatbotUser);

      // TODO 这么提前获取机器人的信息
      if (!this.isLoggedIn) {
        await this.login(chatbotUser.id);
      }

      const senderUser: DTContactRawPayload = {
        corpId: payload.senderCorpId,
        id: payload.senderId,
        name: payload.senderNick,
        staffId: payload.senderStaffId,
        // hack 解决 wechaty 发送消息不会传消息 ID 的问题
        sessionWebhook,
        sessionWebhookExpiredTime,
      };

      contacts.set(senderUser.id, senderUser);

      if (payload.conversationType === '2') {
        const { conversationId, conversationTitle } = payload;

        rooms.set(conversationId, {
          conversationId,
          conversationTitle,
          // hack 解决 wechaty 发送消息不会传消息 ID 的问题
          sessionWebhook,
          sessionWebhookExpiredTime,

          // TODO 临时方案，解决钉钉群成员列表获取不到的问题
          memberList: [chatbotUser, senderUser],
        });
      }

      const messageId = payload.msgId;

      messages.set(messageId, payload);

      this.emit('message', { messageId });
    });

    const waitStable = () => {
      log.verbose('PuppetDingTalk', 'readyStable() emit(ready)');
      this.emit('ready', { data: 'stable' });
    };

    connection.on('reconnected', waitStable);
    connection.on('connected', waitStable);

    connection.on('disconnected', () => {
      if (this.isLoggedIn) this.logout();
    });

    connection.on('error', (err: Error) => {
      this.emit('error', {
        data: GError.stringify(err),
      });
    });

    await connection.start();

    this.connection = connection;
  }

  override async onStop(): Promise<void> {
    if (this.connection) {
      this.connection.close(true, true);
      this.connection = undefined;
    }
  }

  private async unstable_downloadFile(
    robotCode: string,
    downloadCode: string,
    name?: string,
  ): Promise<FileBoxInterface> {
    const msg = await this.client.robots.messages.files.retrieve(robotCode, downloadCode);

    return FileBox.fromUrl(msg.downloadUrl, { name });
  }

  private async unstable__say(conversationId: string, sayable: Sayable, mentionIdList?: string[]): Promise<void> {
    const webhook = this.contacts.get(conversationId) || this.rooms.get(conversationId);

    if (!webhook) {
      throw new Error(`Webhook ${conversationId} not found`);
    }

    const sayer = new SayableSayer(webhook.sessionWebhook, webhook.sessionWebhookExpiredTime);

    await sayer.say(sayable, mentionIdList || []);
  }
}
