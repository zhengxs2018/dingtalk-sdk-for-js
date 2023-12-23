/**
 * 空消息
 *
 * 当不想回复消息到群里时，可以使用空消息
 */
export type EmptyMessagePayload = {
  msgtype: 'empty';
};

/**
 * 文本消息
 */
export type TextMessagePayload = WithAt<{
  msgtype: 'text';
  text: {
    content: string;
  };
}>;

/**
 * Markdown 消息
 */
export type MarkdownMessagePayload = WithAt<{
  msgtype: 'markdown';
  markdown: {
    title: string;
    text: string;
  };
}>;

/**
 * 链接消息
 */
export type LinkMessagePayload = {
  msgtype: 'link';
  link: {
    text: string;
    title: string;
    picUrl: string;
    messageUrl: string;
  };
};

export type ImageMessagePayload = {
  msgtype: 'image';
  image: {
    picURL: string;
  };
};

export type AudioMessagePayload = {
  msgtype: 'audio';
  audio: {
    /**
     * 视频封面图片媒体文件ID
     *
     * 通过上传媒体文件接口得到的 mediaId
     */
    mediaId: string;

    /**
     * 视频时长，单位：豪秒
     */
    duration: number;
  };
};

export type VideoMessagePayload = {
  msgtype: 'video';
  video: {
    /**
     * 视频封面图片媒体文件ID
     *
     * 通过上传媒体文件接口得到的 mediaId
     */
    picMediaId: string;

    /**
     * 视频媒体文件ID
     *
     * 通过上传媒体文件接口得到的 mediaId
     */
    videoMediaId: string;

    /**
     * 视频类型，支持mp4格式。
     *
     * 如：mp4
     */
    videoType: string;

    /**
     * 视频时长，单位：秒
     */
    duration: string | number;
    /**
     * 视频展示宽度，单位px
     */
    width?: string;
    /**
     * 视频展示高度，单位px
     */
    height?: string;
  };
};

export type FileMessagePayload = {
  msgtype: 'file';
  file: {
    mediaId: string;
    fileName: string;
    fileType: string;
  };
};

export type SimpleActionCard = {
  /**
   * 首屏会话透出的展示内容
   */
  title: string;
  /**
   * markdown 格式的消息
   */
  text: string;
  /**
   * 单个按钮的标题
   */
  singleTitle: string;
  /**
   * 点击 singleTitle 按钮触发的URL
   */
  singleURL: string;
};

export enum ActionCardButtonOrientation {
  Vertical = '0',
  Horizontal = '1',
}

export type ActionCardButtonStyle = {
  /**
   * 按钮标题
   */
  title: string;
  /**
   * 点击按钮触发的URL
   */
  actionURL: string;
};

export type ActionCard = {
  /**
   * 首屏会话透出的展示内容
   */
  title: string;
  /**
   * markdown 格式的消息
   */
  text: string;
  /**
   * 按钮排列顺序
   *
   * 0: 按钮竖直排列
   * 1: 按钮横向排列
   */
  btnOrientation: '0' | '1';
  /**
   * 按钮列表
   */
  btns: ActionCardButtonStyle[];
};

/**
 * ActionCard 消息
 */
export type ActionCardMessagePayload = {
  msgtype: 'actionCard';
  actionCard: SimpleActionCard | ActionCard;
};

export type FeedLink = {
  title: string;
  messageURL: string;
  picURL: string;
};

/**
 * FeedCard 消息
 */
export type FeedCardMessagePayload = {
  msgtype: 'feedCard';
  feedCard: {
    links: FeedLink[];
  };
};

/**
 * 互动卡片
 */
export interface InteractiveCardMessagePayload {
  msgtype: 'interactive-card';
  interactiveCard: {
    /**
     * 卡片搭建平台模板ID
     *
     * 固定值填写为StandardCard
     */
    cardTemplateId: string;

    /**
     * 唯一标识一张卡片的外部ID，卡片幂等ID.
     *
     * 可用于更新或重复发送同一卡片到多个群会话。
     */
    cardBizId: string;

    /**
     * 卡片模板文本内容参数，卡片json结构体。
     */
    cardData?: string;

    /**
     * 可控制卡片回调的URL，不填则无需回调。
     */
    callbackUrl?: string;

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
    sendOptions?: {
      atUserListJson?: string;
      atAll?: boolean;
      receiverListJson?: string;
      cardPropertyJson?: string;
    };

    /**
     * 是否开启卡片纯拉模式。
     *
     * true：开启卡片纯拉模式
     * false：不开启卡片纯拉模式
     */
    pullStrategy?: boolean;
  };
}

/**
 * 机器人发送的消息类型
 */
export enum MessageType {
  Empty = 'empty',
  Text = 'text',
  Markdown = 'markdown',
  Link = 'link',
  Image = 'image',
  Audio = 'audio',
  Video = 'video',
  File = 'file',
  ActionCard = 'actionCard',
  FeedCard = 'feedCard',
  InteractiveCard = 'interactive-card',
}

type At = {
  atUserIds?: string[];
  atMobiles?: string[];
  isAtAll?: boolean;
};

type WithAt<T> = T & { at?: At };

type MessagePayloadMap = {
  [MessageType.Empty]: EmptyMessagePayload;
  [MessageType.Text]: TextMessagePayload;
  [MessageType.Markdown]: MarkdownMessagePayload;
  [MessageType.Link]: LinkMessagePayload;
  [MessageType.Image]: ImageMessagePayload;
  [MessageType.Audio]: AudioMessagePayload;
  [MessageType.Video]: VideoMessagePayload;
  [MessageType.File]: FileMessagePayload;
  [MessageType.ActionCard]: ActionCardMessagePayload;
  [MessageType.FeedCard]: FeedCardMessagePayload;
  [MessageType.InteractiveCard]: InteractiveCardMessagePayload;
};

/**
 * 机器人发送的消息类型
 *
 * https://open.dingtalk.com/document/orgapp/robot-message-types-and-data-format
 */
export type MessagePayload = MessagePayloadMap[MessageType];

export type Sayable = string | MessagePayload;
