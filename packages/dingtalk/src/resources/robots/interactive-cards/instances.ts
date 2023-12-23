import { type APIPromise, type RequestOptions } from '@zhengxs/http';

import { APIResource } from '../../../resource';

export class Instances extends APIResource {
  /**
   * 发送互动卡片消息
   *
   * https://open.dingtalk.com/document/orgapp/robots-send-interactive-cards
   */
  create(body: InstanceCreateParams, options?: RequestOptions): APIPromise<InstanceCreation> {
    return this._client.post('/im/v1.0/robot/interactiveCards/send', {
      body,
      ...options,
    });
  }
}

export type InstanceSendOptions = {
  atUserListJson?: string;
  atAll?: boolean;
  receiverListJson?: string;
  cardPropertyJson?: string;
};

interface InstanceCreateParamsBase {
  /**
   * 卡片搭建平台模板ID
   *
   * 固定值填写为StandardCard
   */
  cardTemplateId: string;
  /**
   * 接收卡片的加密群ID，特指多人群会话（非单聊）。
   *
   * openConversationId 和 singleChatReceiver 二选一必填
   */
  openConversationId?: string;

  /**
   * 单聊会话接收者 json 串
   *
   * openConversationId 和 singleChatReceiver 二选一
   */
  singleChatReceiver?: string;

  /**
   * 唯一标识一张卡片的外部ID，卡片幂等ID.
   *
   * 可用于更新或重复发送同一卡片到多个群会话。
   */
  cardBizId: string;

  /**
   * 机器人的编码
   */
  robotCode: string;

  /**
   * 可控制卡片回调的URL，不填则无需回调。
   */
  callbackUrl?: string;

  /**
   * 卡片模板文本内容参数，卡片json结构体。
   */
  cardData: string;

  /**
   * 卡片模板userId差异用户参数，json结构体。
   */
  userIdPrivateDataMap?: string;

  /**
   * 卡片模板unionId差异用户参数，json结构体。
   */
  unionIdPrivateDataMap?: string;

  /**
   * 互动卡片发送选项。
   */
  sendOptions?: InstanceSendOptions;

  /**
   * 是否开启卡片纯拉模式。
   *
   * true：开启卡片纯拉模式
   * false：不开启卡片纯拉模式
   */
  pullStrategy?: boolean;
}

export type InstanceCreateParamsNonRoom = Instances.InstanceCreateParamsNonRoom;

export type InstanceCreateParamsRoom = Instances.InstanceCreateParamsRoom;

export type InstanceCreateParams = InstanceCreateParamsNonRoom | InstanceCreateParamsRoom;

export type InstanceCreation = Instances.InstanceCreation;

export namespace Instances {
  export interface InstanceCreateParamsNonRoom extends InstanceCreateParamsBase {
    singleChatReceiver: string;
  }

  export interface InstanceCreateParamsRoom extends InstanceCreateParamsBase {
    openConversationId: string;
  }

  export type InstanceCreateParams = InstanceCreateParamsNonRoom | InstanceCreateParamsRoom;

  export interface InstanceCreation {
    /**
     * 	用于业务方后续查看已读列表的查询key。
     */
    processQueryKey: string;
  }
}
