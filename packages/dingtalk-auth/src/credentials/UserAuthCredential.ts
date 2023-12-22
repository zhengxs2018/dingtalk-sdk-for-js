import { type GetTokenParams, type TokenResponse } from './TokenCredential';
import { BaseTokenCredential } from './TokenSessionCredential';

export interface UserAuthCredentialOptions {
  /**
   * 应用 ID
   *
   * 可使用扫码登录应用或者第三方个人小程序的 appId。
   *
   * - 企业内部应用传应用的 AppKey
   * - 第三方企业应用传应用的 SuiteKey
   * - 第三方个人应用传应用的 AppId
   */
  clientId?: string;

  /**
   * 应用密钥
   *
   * 企业内部应用传应用的 AppSecret
   * 第三方企业应用传应用的 SuiteSecret
   * 第三方个人应用传应用的 AppSecret
   */
  clientSecret?: string;
}

/**
 * 获取企业内部应用的授权凭证
 *
 * @see https://open.dingtalk.com/document/orgapp/obtain-the-access_token-of-an-internal-app
 */
export class UserAuthCredential extends BaseTokenCredential<UserGetTokenParams> {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;

  constructor(params?: UserAuthCredentialOptions) {
    super();

    const { clientId, clientSecret } = params || {};

    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  exchangeCode(code: string) {
    return this.getToken({ code });
  }

  getToken(params: UserGetTokenParamsWithCode): Promise<UserTokenResponse>;
  getToken(params: UserGetTokenParamsWithRefreshToken): Promise<UserTokenResponse>;
  getToken(params: UserGetTokenParams): Promise<UserTokenResponse> {
    const { clientId = this.clientId, clientSecret = this.clientSecret, refreshToken, code, grantType } = params;

    const body: UserGetTokenParamsBase = {
      clientId,
      clientSecret,
      grantType,
    };

    if (code) {
      body.code = code;
      body.grantType ??= 'authorization_code';
    } else {
      body.refreshToken = refreshToken;
      body.grantType ??= 'refresh_token';
    }

    const client = this.getClient();

    return client.simple('/oauth2/userAccessToken', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });
  }
}

export interface UserTokenResponse extends TokenResponse {
  /**
   * 所选企业 corpId
   */
  corpId: string;

  /**
   * 刷新令牌
   */
  refreshToken: string;
}

export interface UserGetTokenParamsBase extends UserAuthCredentialOptions, GetTokenParams {
  /**
   * 临时授权码
   *
   * OAuth 2.0 临时授权码，根据获取登录用户的访问凭证内容，获取临时授权码authCode。
   *
   * @see https://open.dingtalk.com/document/orgapp/obtain-identity-credentials
   */
  code?: string;

  /**
   * 刷新令牌
   */
  refreshToken?: string;

  /**
   * 授权方式
   *
   * 如果使用授权码换 token，传 authorization_code。
   * 如果使用刷新token换用户token，传refresh_token。
   */
  grantType?: string;
}

export interface UserGetTokenParamsWithCode extends UserGetTokenParamsBase {
  code: string;
  grantType?: 'authorization_code';
}

export interface UserGetTokenParamsWithRefreshToken extends UserGetTokenParamsBase {
  refreshToken: string;
  grantType?: 'refresh_token';
}

export type UserGetTokenParams = UserGetTokenParamsWithCode | UserGetTokenParamsWithRefreshToken;
