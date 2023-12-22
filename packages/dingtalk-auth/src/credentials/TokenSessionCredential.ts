import { IdentityClient } from '../IdentityClient';
import type { GetTokenParams, TokenCredential, TokenResponse } from './TokenCredential';

/**
 * 获取微应用后台免登的授权凭证
 */
export abstract class BaseTokenCredential<Params = GetTokenParams> implements TokenCredential<Params> {
  protected client!: IdentityClient;

  getClient() {
    if (!this.client) {
      this.client = new IdentityClient();
      // @ts-expect-error
      this.client.setCredential(this);
    }

    return this.client;
  }

  setClient(client: IdentityClient) {
    this.client = client;
  }

  getTokenValue(params: Params) {
    return this.getToken(params).then(token => token.accessToken);
  }

  abstract getToken(params: Params): Promise<TokenResponse>;
}

export abstract class TokenSessionCredential<Params = GetTokenParams> extends BaseTokenCredential<Params> {
  protected token?: TokenResponse;
  protected expiredAt?: number;
  protected promise?: Promise<TokenResponse>;

  getToken(params: Params) {
    if (this.promise) return this.promise;

    if (this.token && this.expiredAt && this.expiredAt > Date.now()) {
      return Promise.resolve(this.token);
    }

    this.promise = this.request(params).then(token => {
      this.token = token;
      this.expiredAt = Date.now() + (token.expireIn - 120) * 1000;
      return token;
    });

    this.promise.finally(() => {
      this.promise = undefined;
    });

    return this.promise;
  }

  protected abstract request(params: Params): Promise<TokenResponse>;
}
