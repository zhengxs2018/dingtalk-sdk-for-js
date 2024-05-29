import { type AuthCredential, type IdentityClient } from '@zhengxs/dingtalk-auth';

import { HubConnection, type HubConnectionOptions } from './connection';
import { HttpLink } from './HttpLink';
import { type ConnectionParamsOptions } from './types';

export class HubConnectionBuilder {
  protected url?: string;
  protected httpLink?: HttpLink;

  withUrl(url: string): HubConnectionBuilder {
    this.url = url;
    return this;
  }

  withCredential(credential: AuthCredential, options?: ConnectionParamsOptions): HubConnectionBuilder {
    this.httpLink = new HttpLink({ credential, ...options });
    return this;
  }

  withClient(client: IdentityClient<AuthCredential>, options?: ConnectionParamsOptions): HubConnectionBuilder {
    this.httpLink = new HttpLink({ client, ...options });
    return this;
  }

  build(options?: HubConnectionOptions) {
    return new HubConnection({
      url: this.url,
      httpLink: this.httpLink,
      ...options,
    });
  }
}
