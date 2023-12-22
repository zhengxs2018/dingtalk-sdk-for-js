import type { APIClient } from '@zhengxs/http';

export interface TokenResponse {
  /**
   * 授权凭证
   */
  accessToken: string;

  /**
   * 过期时间，单位秒
   */
  expireIn: number;
}

export type GetTokenParams = NonNullable<unknown>;

/**
 * 授权凭证
 *
 * @see https://open.dingtalk.com/document/orgapp/authorization-overview
 */
export interface TokenCredential<Params = GetTokenParams | void> {
  /**
   * 设置请求客户端
   *
   * @internal
   */
  setClient(client: APIClient): void;

  /**
   * 获取授权凭证
   *
   * @param params - 获取授权凭证参数
   * @returns 授权凭证
   */
  getToken(params: Params): Promise<TokenResponse>;

  /**
   * 获取授权凭证值
   *
   * @param params - 获取授权凭证参数
   * @returns 授权凭证值
   */
  getTokenValue(params: Params): Promise<string>;
}

export type ExtractGetTokenParams<Credential> = Credential extends TokenCredential<infer Params>
  ? Params
  : GetTokenParams;
