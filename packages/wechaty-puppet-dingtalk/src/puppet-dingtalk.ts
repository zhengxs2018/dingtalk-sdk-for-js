import { extname } from 'node:path';

import { Dingtalk } from '@zhengxs/dingtalk';
import { AuthCredential } from '@zhengxs/dingtalk-auth';
import { type HubConnection, HubConnectionBuilder } from '@zhengxs/dingtalk-event-hubs';
import { toFile } from '@zhengxs/http';
import { FileBox, type FileBoxInterface } from 'file-box';
import { GError } from 'gerror';
import Keyv from 'keyv'
import * as PUPPET from 'wechaty-puppet';
import { log } from 'wechaty-puppet';
import QuickLRU from '@alloc/quick-lru'

import {
  type DTMediaMessageRawPayload,
  type Sayable,
  SayableSayer,
  DTContactType,
  type DTSessionWebhookRawPayload,
  type DTContactRawPayload,
  dtContactToWechaty,
  dtRoomMemberToWechaty,
  type DTMessageRawPayload,
  dtMessageToWechaty,
  DTMessageType,
  type DTRoomRawPayload,
  dtRoomToWechaty,
  type MessagePayload,
} from './dingtalk';

const AttachmentExtRE = /\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf|rar)$/i;
const AudioExtRE = /\.(mp3|wav|wma|ogg|aac|flac)$/i;
const VideoExtRE = /\.(mp4|mov|avi|rmvb|mkv|flv|rm|asf|3gp|wmv)$/i;
const ImageExtRE = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;

/**
 * 获取视频或音频的时长
 *
 * 如果是视频或音频，需要手动传递时长，而且是强制要求传递时长的。
 * 但调用钉钉的上传接口，钉钉并没有返回时长，所以需要手动获取时长。
 *
 * 参考：[机器人发送消息的类型](https://open.dingtalk.com/document/orgapp/types-of-messages-sent-by-robots)
 *
 * @example 修复音频时长
 *
 * ```ts
 * import os from 'node:os';
 * import path from 'node:path';
 * import { unlinkSync } from 'node:fs';
 *
 * import { PuppetDingTalk } from '@zhengxs/wechaty-puppet-dingtalk'
 * import { getAudioDurationInSeconds } from 'get-audio-duration'
 *
 * const puppet = new PuppetDingTalk({
 *   async getAudioDurationInSeconds(fileBox) {
 *     // 生成临时文件地址
 *     const saveTo = path.resolve(os.tmpdir(), fileBox.name)
 *
 *     // 保存到临时文件
 *     await fileBox.toFile(saveTo)
 *
 *     try {
 *       // 获取时长
 *       return await getAudioDurationInSeconds(saveTo)
 *     } finally {
 *        // 删除临时文件
 *        unlinkSync(saveTo)
 *     }
 *   },
 * })
 * ```
 */
export type GetMediaDurationInSeconds = (fileBox: FileBoxInterface) => Promise<number>

export interface PuppetDingTalkOptions extends PUPPET.PuppetOptions {
  /**
   * 钉钉应用ID
   *
   * 和 `credential` 二选一
   */
  clientId?: string;
  /**
   * 钉钉应用密钥
   *
   * 和 `credential` 二选一
   */
  clientSecret?: string;
  /**
   * 钉钉凭证
   *
   * 和 `clientId`、`clientSecret` 二选一
   */
  credential?: AuthCredential;
  /**
   * 群数据缓存
   */
  roomsStore?: Keyv<DTRoomRawPayload>
  /**
   * 联系人数据缓存
   */
  contactsStore?: Keyv<DTContactRawPayload>
  /**
   * 消息数据缓存
   */
  messagesStore?: Keyv<DTMessageRawPayload>
  /**
   * 会话 Webhook 数据缓存
   */
  sessionWebhooksStore?: Keyv<DTSessionWebhookRawPayload>
  /**
   * 登出后是否清理缓存
   *
   * 默认为 `true`
   */
  clearCacheAfterLogout?: boolean;

  /**
   * 获取视频时长
   *
   * @returns 以秒为单位的视频时长
   */
  getVideoDurationInSeconds?: GetMediaDurationInSeconds

  /**
   * 获取视频时长
   *
   * @returns 以秒为单位的视频时长
   */
  getAudioDurationInSeconds?: GetMediaDurationInSeconds
}

export class PuppetDingTalk extends PUPPET.Puppet {
  protected _dkClient: Dingtalk;
  protected _dkCredential: AuthCredential;
  protected _dkConnection?: HubConnection;

  protected _roomsStore: Keyv<DTRoomRawPayload>
  protected _contactsStore: Keyv<DTContactRawPayload>
  protected _messagesStore: Keyv<DTMessageRawPayload>
  protected _sessionWebhooksStore: Keyv<DTSessionWebhookRawPayload>

  protected _clearCacheAfterLogout: boolean

  protected _getVideoDurationInSeconds: GetMediaDurationInSeconds
  protected _getAudioDurationInSeconds: GetMediaDurationInSeconds

  constructor(options: PuppetDingTalkOptions = {}) {
    const {
      clientId = process.env.DINGTALK_CLIENT_ID,
      clientSecret = process.env.DINGTALK_CLIENT_SECRET,
      credential = new AuthCredential({ clientId, clientSecret }),
      cache,
      // TODO 默认改成 LRU 缓存
      contactsStore = new Keyv({
        store: new QuickLRU({ maxSize: cache?.contact || 9999 }),
      }),
      roomsStore = new Keyv({
        store: new QuickLRU({ maxSize: cache?.room || 9999 }),
      }),
      messagesStore = new Keyv({
        store: new QuickLRU({ maxSize: cache?.message || 99999 }),
      }),
      sessionWebhooksStore = new Keyv({
        store: new QuickLRU({
          maxSize: 99999,
        }),
      }),
      clearCacheAfterLogout = true,
      getAudioDurationInSeconds,
      getVideoDurationInSeconds,
      ...rest
    } = options;

    super({ cache, ...rest });

    this._dkCredential = credential;
    this._dkClient = new Dingtalk({ credential });

    this._getAudioDurationInSeconds = getAudioDurationInSeconds || this.unstable_defaultGetAudioDurationInSeconds
    this._getVideoDurationInSeconds = getVideoDurationInSeconds || this.unstable_defaultGetVideoDurationInSeconds

    this._contactsStore = contactsStore
    this._roomsStore = roomsStore
    this._messagesStore = messagesStore
    this._sessionWebhooksStore = sessionWebhooksStore
    this._clearCacheAfterLogout = clearCacheAfterLogout
  }

  override async roomRawPayload(roomId: string): Promise<DTRoomRawPayload> {
    log.verbose('PuppetDingTalk', 'roomRawPayload(%s)', roomId);

    const roomsStore = this._roomsStore;
    const rawPayload = await roomsStore.get(roomId);

    if (!rawPayload) {
      throw new GError({
        code: 5,
        message: `PuppetDingTalk: Room ${roomId} not found`
      });
    }

    return rawPayload
  }

  override async roomRawPayloadParser(rawPayload: DTRoomRawPayload): Promise<PUPPET.payloads.Room> {
    return dtRoomToWechaty(this, rawPayload);
  }

  override async roomMemberList(roomId: string): Promise<string[]> {
    log.verbose('PuppetDingTalk', 'roomMemberList(%s)', roomId);

    const rawPayload = await this.roomRawPayload(roomId);

    return rawPayload.memberIdList || [];
  }

  // TODO 需要这么严谨的判断是否在群里吗？
  override async roomMemberRawPayload(roomId: string, contactId: string): Promise<DTContactRawPayload | void> {
    log.verbose('PuppetDingTalk', 'roomMemberRawPayload(%s, %s)', roomId, contactId);

    const contactsStore = this._contactsStore;
    const rawPayload = await contactsStore.get(contactId);

    if (!rawPayload) {
      throw new GError({
        code: 5,
        message: `PuppetDingTalk: Contacts ${contactId} not found in Room(${roomId})`
      });
    }

    return rawPayload
  }

  override async roomMemberRawPayloadParser(rawPayload: DTContactRawPayload): Promise<PUPPET.payloads.RoomMember> {
    return dtRoomMemberToWechaty(rawPayload);
  }

  override async contactRawPayload(contactId: string): Promise<DTContactRawPayload | void> {
    log.verbose('PuppetDingTalk', 'contactRawPayload(%s)', contactId);

    const contactsStore = this._contactsStore;
    const rawPayload = await contactsStore.get(contactId);

    if (!rawPayload) {
      throw new GError({
        code: 5,
        message: `PuppetDingTalk: Contacts ${contactId} not found`
      });
    }

    return rawPayload
  }

  override async contactRawPayloadParser(rawPayload: DTContactRawPayload): Promise<PUPPET.payloads.Contact> {
    return dtContactToWechaty(this, rawPayload);
  }

  override async messageRawPayload(messageId: string): Promise<DTMessageRawPayload> {
    log.verbose('PuppetDingTalk', 'messageRawPayload(%s) with messages.length=%d', messageId);

    const messagesStore = this._messagesStore;
    const rawPayload = await messagesStore.get(messageId);

    if (!rawPayload) {
      throw new GError({
        code: 5,
        message: `PuppetDingTalk: Message ${messageId} not found`
      });
    }

    return rawPayload
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

    const files = this._dkClient.files;

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
        const [
          fileObj,
          duration,
        ] = await Promise.all([
          files.create({
            type: 'voice',
            media: await toFile(fileBox.toStream(), fileBox.name),
          }),
          this._getAudioDurationInSeconds(fileBox),
        ]);

        await this.unstable__say(conversationId, {
          msgtype: 'audio',
          audio: {
            mediaId: fileObj.media_id,
            duration: Math.floor(duration * 1000),
          },
        });

        break
      }

      case VideoExtRE.test(ext): {
        throw new Error(`暂不支持视频的发送`);
      }

      case ImageExtRE.test(ext): {
        // hack 强制获取私有的 remoteUrl 属性
        // @ts-expect-error
        const remoteUrl = fileBox.remoteUrl
        if (remoteUrl) {
          await this.unstable__say(conversationId, {
            msgtype: 'image',
            image: {
              picURL: remoteUrl,
            },
          });
          break
        }

        throw new GError({
          code: 12,
          message: '暂不支持以本地文件的方式上传图片'
        })
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

    const connection = new HubConnectionBuilder().withCredential(this._dkCredential).build();

    const roomsStore = this._roomsStore;
    const contactsStore = this._contactsStore;
    const messagesStore = this._messagesStore;
    const sessionWebhooksStore = this._sessionWebhooksStore;

    connection.on('message', async event => {
      const payload: DTMessageRawPayload = JSON.parse(event.data);

      const {
        msgId,
        senderId,
        chatbotUserId,
        conversationId,
        sessionWebhook,
        sessionWebhookExpiredTime,
      } = payload

      const sessionWebhookPayload: DTSessionWebhookRawPayload = {
        msgId,
        senderId,
        chatbotUserId,
        conversationId,
        sessionWebhook,
        sessionWebhookExpiredTime,
      }

      const storeQueue = [
        messagesStore.set(msgId, payload),
        contactsStore.set(senderId, {
          corpId: payload.senderCorpId,
          id: payload.senderId,
          name: payload.senderNick,
          avatar: '',
          staffId: payload.senderStaffId,
          type: DTContactType.User,
          sessionWebhook,
          sessionWebhookExpiredTime,
        }),
        // Note: 重复保存是为了更新 sessionWebhook
        contactsStore.set(chatbotUserId, {
          id: chatbotUserId,
          corpId: payload.chatbotCorpId,
          staffId: payload.robotCode,
          name: `🤖️ 默认`, // TODO 需要自定义机器人名称？
          avatar: '',
          type: DTContactType.Robot,
          sessionWebhook,
          sessionWebhookExpiredTime,
        }),
        // Note: wechaty 的消息发送不传递消息ID回来，只给联系人ID 和 群ID
        // 为了快速找到 sessionWebhook，以联系人ID 和 群 ID 各写一次
        sessionWebhooksStore.set(senderId, sessionWebhookPayload, sessionWebhookExpiredTime),
      ]

      if (payload.conversationType === '2') {
        const roomPayload: DTRoomRawPayload = {
          id: conversationId,
          topic: payload.conversationTitle!,
          memberIdList: [chatbotUserId, senderId],
          adminIdList: [],
          sessionWebhook,
          sessionWebhookExpiredTime,
        }

        if (payload.isAdmin) {
          roomPayload.adminIdList.push(senderId);
        }

        storeQueue.push(
          roomsStore.set(conversationId, roomPayload),
          // Note: 理由同上
          sessionWebhooksStore.set(conversationId, sessionWebhookPayload, sessionWebhookExpiredTime)
        );
      }

      // Note: 存储机器人用户信息后，再触发登录事件
      await Promise.all(storeQueue)

      // Note: 未登录，就触发登录事件
      if (!this.isLoggedIn) {
        await this.login(senderId);
      }

      this.emit('message', { messageId: payload.msgId });
    });

    const waitStable = () => {
      log.verbose('PuppetDingTalk', 'readyStable() emit(ready)');
      this.emit('ready', { data: 'stable' });
    };

    connection.on('reconnected', waitStable);
    connection.on('connected', waitStable);

    connection.on('disconnected', () => {
      if (!this.isLoggedIn) return

      // 清理缓存
      if (this._clearCacheAfterLogout) {
        this._contactsStore.clear()
        this._roomsStore.clear()
        this._messagesStore.clear()
        this._sessionWebhooksStore.clear()
      }

      this.logout();
    });

    connection.on('error', (err: Error) => {
      this.emit('error', {
        data: GError.stringify(err),
      });
    });

    await connection.start();

    this._dkConnection = connection;
  }

  override async onStop(): Promise<void> {
    if (this._dkConnection) {
      this._dkConnection.close(true, true);
      this._dkConnection = undefined;
    }
  }

  private async unstable__say(conversationId: string, sayable: Sayable, mentionIdList?: true | string[]): Promise<void> {
    const rawPayload = await this._sessionWebhooksStore.get(conversationId)

    if (!rawPayload) {
      this.emit('error', {
        data: GError.stringify(`Webhook ${conversationId} does not exist or has expired`),
      })
      return
    }

    const sender = new SayableSayer(
      rawPayload.sessionWebhook,
      rawPayload.sessionWebhookExpiredTime,
    )

    // @ts-expect-error
    await sender.say(sayable, mentionIdList);
  }

  private async unstable_downloadFile(
    robotCode: string,
    downloadCode: string,
    name?: string,
  ): Promise<FileBoxInterface> {
    const files = this._dkClient.robots.messages.files;
    const msg = await files.retrieve(robotCode, downloadCode);

    return FileBox.fromUrl(msg.downloadUrl, { name });
  }

  protected unstable_defaultGetAudioDurationInSeconds: GetMediaDurationInSeconds = function (_fileBox) {
    return Promise.resolve(1)
  }

  protected unstable_defaultGetVideoDurationInSeconds: GetMediaDurationInSeconds = function (_fileBox) {
    return Promise.resolve(1)
  }
}
