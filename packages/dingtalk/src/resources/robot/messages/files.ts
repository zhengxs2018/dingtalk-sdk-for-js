import { type RequestOptions } from '@zhengxs/http';

import { APIResource } from '../../../resource';

export class Files extends APIResource {
  endpoint = '/robot/messageFiles/download';

  /**
   * 下载机器人接收消息的文件内容
   *
   * See https://open.dingtalk.com/document/orgapp/download-the-file-content-of-the-robot-receiving-message
   */
  async retrieve(robotCode: string, downloadCode: string, options?: RequestOptions): Promise<MessageFile> {
    return this._client.post('/robot/messageFiles/download', {
      body: {
        downloadCode: downloadCode,
        robotCode: robotCode,
      },
      ...options,
    });
  }
}

export type MessageFile = Files.MessageFile;

export namespace Files {
  export type MessageFile = {
    /**
     * 文件下载地址
     */
    downloadUrl: string;
  };
}
