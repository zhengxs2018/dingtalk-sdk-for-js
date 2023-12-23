import { AuthCredential, CorpAuthCredential, IdentityClient } from '@zhengxs/dingtalk-auth';

import type { ConnectionParamsOptions, OperationOption } from './types';

const defaultConnectionParams: ConnectionParamsOptions = {
  ua: '',
  subscriptions: [
    {
      type: 'SYSTEM',
      topic: '*',
    },
    {
      type: 'CALLBACK',
      topic: '/v1.0/im/bot/messages/get',
    },
  ],
};

export interface HttpLinkOptions extends ConnectionParamsOptions {
  client?: IdentityClient<AuthCredential | CorpAuthCredential>;
  credential?: AuthCredential | CorpAuthCredential;
}

export class HttpLink {
  protected client: IdentityClient<AuthCredential | CorpAuthCredential>;
  protected credential: AuthCredential | CorpAuthCredential;

  protected ua: string;
  protected subscriptions: OperationOption[];

  constructor(options: HttpLinkOptions) {
    const { client, credential, ua = '', subscriptions = [] } = options;

    if (client) {
      this.client = client;
    } else {
      this.client = credential?.getClient() as IdentityClient<AuthCredential>;
    }

    if (credential) {
      this.credential = credential;
    } else {
      this.credential = client?.getCredential() as AuthCredential;
    }

    this.ua = ua;
    this.subscriptions = subscriptions;
  }

  async create(): Promise<string> {
    return createHttpLink({
      client: this.client,
      credential: this.credential,
      ua: this.ua,
      subscriptions: this.subscriptions,
    });
  }
}

export async function createHttpLink({ client, credential, ...rest }: Required<HttpLinkOptions>): Promise<string> {
  const token = await credential.getToken();

  const json: Record<string, string> = await client.simple('/gateway/connections/open', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'access-token': token.accessToken,
    },
    body: {
      ...defaultConnectionParams,
      clientId: credential!.clientId,
      clientSecret: credential!.clientSecret,
      rest,
    },
  });

  return `${json.endpoint}?ticket=${json.ticket}`;
}
