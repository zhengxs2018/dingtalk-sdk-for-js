import { type GetTokenParams, type TokenResponse } from './TokenCredential';
import { TokenSessionCredential } from './TokenSessionCredential';

/**
 * 获取微应用后台免登的授权凭证
 *
 * @see https://open.dingtalk.com/document/orgapp/obtain-the-access_token-of-the-micro-application-background-without-log-on
 */
export class SSOAuthCredential extends TokenSessionCredential<SSOAuthGetTokenParams | void> {
  /**
   * 企业ID
   */
  corpId?: string;

  /**
   * sso密钥
   */
  ssoSecret?: string;

  constructor(params?: SSOAuthGetTokenParams) {
    super();

    const { corpId, ssoSecret } = params || {};

    this.corpId = corpId;
    this.ssoSecret = ssoSecret;
  }

  protected request(params?: SSOAuthGetTokenParams): Promise<TokenResponse> {
    const { corpId = this.corpId, ssoSecret = this.ssoSecret } = params || {};

    const client = this.getClient();

    return client.simple('/oauth2/ssoAccessToken', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        corpId,
        ssoSecret,
      },
    });
  }
}

export interface SSOAuthGetTokenParams extends GetTokenParams {
  /**
   * 企业ID
   */
  corpId?: string;
  /**
   * sso密钥
   */
  ssoSecret?: string;
}
