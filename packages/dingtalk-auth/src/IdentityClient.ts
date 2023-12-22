import {
  APIClient,
  type APIClientOptions,
  APIPromise,
  type APIResponseProps,
  debug,
  type FinalRequestOptions,
  type PromiseOrValue,
  Stream,
} from '@zhengxs/http';

import type { TokenResponse } from '../dist-types';
import { type TokenCredential } from './credentials/TokenCredential';
import { assertErrCodeOfZero } from './util';

/**
 * 企业内部应用网关地址
 */
const BASE_URL = 'https://api.dingtalk.com/v1.0' as const;

export interface IdentityClientOptions<Credential extends TokenCredential = TokenCredential>
  extends Partial<APIClientOptions> {
  credential?: Credential;
}

export class IdentityClient<Credential extends TokenCredential = TokenCredential> extends APIClient {
  private credential?: Credential;

  constructor(options?: IdentityClientOptions<Credential>) {
    const { baseURL = BASE_URL, credential, ...rest } = options || {};

    super({ baseURL, ...rest });

    this.credential = credential;
  }

  getCredential(): Credential {
    if (!this.credential) {
      throw new Error(`请先选择设置授权方式`);
    }

    return this.credential;
  }

  setCredential(credential: Credential) {
    this.credential = credential;
    this.credential.setClient(this);
  }

  getToken(): Promise<TokenResponse> {
    const credential = this.getCredential();
    return credential.getToken();
  }

  getTokenValue(): Promise<string> {
    const credential = this.getCredential();
    return credential.getTokenValue();
  }

  request<Req extends NonNullable<unknown>, Rsp>(
    options: PromiseOrValue<FinalRequestOptions<Req>>,
    remainingRetries: number | null = null,
  ): APIPromise<Rsp> {
    return new APIPromise(
      this.makeRequest(options, remainingRetries),
      dingtalkParseResponse as (props: APIResponseProps) => PromiseOrValue<Rsp>,
    );
  }

  protected override async authHeaders(): Promise<Record<string, string>> {
    const accessToken = await this.getTokenValue();
    return { 'x-acs-dingtalk-access-token': accessToken };
  }
}

export async function dingtalkParseResponse<T>(props: APIResponseProps): Promise<T> {
  const { response } = props;
  if (props.options.stream) {
    debug('response', response.status, response.url, response.headers, response.body);

    // Note: there is an invariant here that isn't represented in the type system
    // that if you set `stream: true` the response type must also be `Stream<T>`
    return Stream.fromSSEResponse(response, props.controller) as any;
  }

  // fetch refuses to read the body when the status code is 204.
  if (response.status === 204) {
    return null as T;
  }

  if (props.options.__binaryResponse) {
    return response as unknown as T;
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    const json = await response.json();

    debug('response', response.status, response.url, response.headers, json);

    assertErrCodeOfZero(json);

    return json as T;
  }

  const text = await response.text();
  debug('response', response.status, response.url, response.headers, text);

  // TODO handle blob, arraybuffer, other content types, etc.
  return text as unknown as T;
}
