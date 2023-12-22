import { Dingtalk } from './index';

export class APIResource {
  protected _client: Dingtalk;

  constructor(client: Dingtalk) {
    this._client = client;
  }
}
