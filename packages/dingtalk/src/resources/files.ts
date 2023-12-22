import { type APIPromise, multipartFormRequestOptions, type RequestOptions, type Uploadable } from '@zhengxs/http';

import { APIResource } from '../resource';

export class Files extends APIResource {
  /**
   * 上传媒体文件
   *
   * https://open.dingtalk.com/document/orgapp/upload-media-files
   */
  create(body: FileCreateParams, options?: RequestOptions): APIPromise<FileObject> {
    const client = this._client;

    const init = client.getTokenValue().then(access_token => {
      return multipartFormRequestOptions({
        query: { access_token },
        body: body,
        duplex: 'half',
        ...options,
      });
    });

    return client.post('https://oapi.dingtalk.com/media/upload', init);
  }
}

export type FileCreateParams = Files.FileCreateParams;

export type FileObject = Files.FileObject;

export namespace Files {
  export interface FileCreateParams {
    /**
     * 媒体文件类型
     *
     * - image：图片，图片最大20MB。支持上传jpg、gif、png、bmp格式。
     * - voice：语音，语音文件最大2MB。支持上传amr、mp3、wav格式。
     * - video：视频，视频最大20MB。支持上传mp4格式。
     * - file：普通文件，最大20MB。支持上传doc、docx、xls、xlsx、ppt、pptx、zip、pdf、rar格式。
     *
     * See [Body参数](https://open.dingtalk.com/document/orgapp/upload-media-files#h2-xg2-l8o-066)
     */
    type: 'image' | 'voice' | 'video' | 'file';

    /**
     * 需要上传的文件对象
     */
    media: Uploadable;
  }

  /**
   * 上传后返回的文件对象
   */
  export interface FileObject {
    /**
     * 媒体文件类型
     */
    type: 'image' | 'voice' | 'video' | 'file';

    /**
     * 媒体文件上传后获取的唯一标识
     */
    media_id: string;

    /**
     * 媒体文件上传时间戳
     *
     * 单位：毫秒
     */
    created_at: number;
  }
}

/**
 * 从文件内容上传
 *
 * @see https://open.dingtalk.com/document/orgapp/upload-media-files
 * @param type - 上传类型
 * @param data - 文件内容
 * @param filename - 文件名
 * @returns 上传结果
 */
// async putFromObject<Type extends MediaType = MediaType>(
//   type: Type,
//   data: BlobPart,
//   filename?: string,
// ): Promise<UploadResult<Type>> {
//   const { client } = this;
//   const url = new URL(this.endpoint, OPEN_API_GATEWAY_URL);

//   url.searchParams.set('access_token', await client.getAccessToken());

//   const form = new FormData();

//   form.append('type', type);
//   form.append('media', new Blob([data]), filename);

//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//     },
//     body: form,
//   });

//   const result: UploadResult<Type> = await response.json();

//   if (result.errcode === 0) return result;

//   throw new InvalidResultError(result.errmsg);
// }
