import { APIResource } from '../../../resource';
import * as FilesAPI from './files';

export class Messages extends APIResource {
  files: FilesAPI.Files = new FilesAPI.Files(this._client);
}

export namespace Messages {
  export type Files = FilesAPI.Files;
  export type MessageFile = FilesAPI.MessageFile;
}
