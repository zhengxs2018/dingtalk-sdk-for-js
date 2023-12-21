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
  msgtype: 'picture';
  image: {
    photoURL: string;
  };
};

export type AudioMessagePayload = {
  msgtype: 'audio';
  audio: {
    mediaId: string;
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
     */
    videoType: number;
    /**
     * 视频时长，单位：秒
     */
    duration: string;
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

export type SingleButtonActionCard = {
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

export type MultiButtonActionCard = {
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
  btnOrientation: ActionCardButtonOrientation;
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
  actionCard: SingleButtonActionCard | MultiButtonActionCard;
};

export type FeedLink = {
  title: string;
  messageURL: string;
  picURL: string;
};

/**
 * FeedCard 消息
 *
 * 接口方式不支持
 */
export type FeedCardMessagePayload = {
  msgtype: 'feedCard';
  feedCard: {
    links: FeedLink[];
  };
};

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
};

/**
 * 机器人发送的消息类型
 *
 * https://open.dingtalk.com/document/orgapp/robot-message-types-and-data-format
 */
export type MessagePayload = MessagePayloadMap[MessageType];
