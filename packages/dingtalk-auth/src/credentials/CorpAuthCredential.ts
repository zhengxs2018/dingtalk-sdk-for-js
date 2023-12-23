import { type GetTokenParams, type TokenResponse } from './TokenCredential';
import { TokenSessionCredential } from './TokenSessionCredential';

/**
 * 产品服务商获取授权企业的授权凭证
 *
 * @see https://open.dingtalk.com/document/orgapp/obtain-the-access_token-of-the-authorized-enterprise
 */
export class CorpAuthCredential extends TokenSessionCredential<CorpAuthGetTokenParams | void> {
  suiteKey?: string;
  suiteSecret?: string;
  authCorpId?: string;
  suiteTicket?: string;

  constructor(options: CorpAuthGetTokenParams = {}) {
    super();

    const { suiteKey, suiteSecret, authCorpId, suiteTicket } = options;

    this.suiteKey = suiteKey;
    this.suiteSecret = suiteSecret;
    this.authCorpId = authCorpId;
    this.suiteTicket = suiteTicket;
  }

  get clientId(): string | undefined {
    return this.suiteKey;
  }

  get clientSecret(): string | undefined {
    return this.suiteSecret;
  }

  protected override request(params: CorpAuthGetTokenParams): Promise<TokenResponse> {
    const {
      suiteKey = this.suiteKey,
      suiteSecret = this.suiteSecret,
      authCorpId = this.authCorpId,
      suiteTicket = this.suiteTicket,
    } = params || {};

    const client = this.getClient();
    return client.simple('/oauth2/corpAccessToken', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        suiteKey,
        suiteSecret,
        authCorpId,
        suiteTicket,
      },
    });
  }
}

export interface CorpAuthGetTokenParams extends GetTokenParams {
  /**
   * 定制应用的 CustomKey。
   */
  suiteKey?: string;
  /**
   * 定制应用的 CustomSecret。
   */
  suiteSecret?: string;
  /**
   * 授权企业的 CorpId。
   */
  authCorpId?: string;
  /**
   * 钉钉推送的suiteTicket，定制应用该参数自定义，比如 Test。
   */
  suiteTicket?: string;
}
