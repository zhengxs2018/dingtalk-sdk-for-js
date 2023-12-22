import { type GetTokenParams, type TokenResponse } from './TokenCredential';
import { TokenSessionCredential } from './TokenSessionCredential';

/**
 * 获取企业内部应用的授权凭证
 *
 * @see https://open.dingtalk.com/document/orgapp/obtain-the-access_token-of-an-internal-app
 */
export class AuthCredential extends TokenSessionCredential<AuthGetTokenParams | void> {
  clientId?: string;
  clientSecret?: string;

  constructor(params?: AuthGetTokenParams) {
    super();

    const { clientId, clientSecret } = params || {};

    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  protected request(params?: AuthGetTokenParams): Promise<TokenResponse> {
    const { clientId = this.clientId, clientSecret = this.clientSecret } = params || {};

    const client = this.getClient();
    return client.simple('/oauth2/accessToken', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        appKey: clientId,
        appSecret: clientSecret,
      },
    });
  }
}

export interface AuthGetTokenParams extends GetTokenParams {
  /**
   * 企业内部开发 AppKey
   * 第三方企业应用 SuiteKey。
   */
  clientId?: string;
  /**
   * 企业内部开发 AppSecret
   * 第三方企业应用 SuiteSecret
   */
  clientSecret?: string;
}
