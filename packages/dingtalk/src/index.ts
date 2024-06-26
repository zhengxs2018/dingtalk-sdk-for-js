import {
  type AuthCredential,
  type CorpAuthCredential,
  IdentityClient,
  type IdentityClientOptions,
} from '@zhengxs/dingtalk-auth';
import {
  APIConnectionError,
  APIConnectionTimeoutError,
  APIError,
  APIUserAbortError,
  AuthenticationError,
  BadRequestError,
  ConflictError,
  HttpException as DingtalkError,
  InternalServerError,
  NotFoundError,
  PermissionDeniedError,
  RateLimitError,
  UnprocessableEntityError,
} from '@zhengxs/http';

import * as API from './resources';

export type DingtalkCredential = AuthCredential | CorpAuthCredential;

export type DingtalkOptions = IdentityClientOptions<DingtalkCredential>;

// TODO: 支持 CorpAuthCredential 第三方应用
export class Dingtalk extends IdentityClient<DingtalkCredential> {
  robots = new API.Robots(this);

  files: API.Files = new API.Files(this);

  static Dingtalk = this;

  static DingtalkError = DingtalkError;
  static APIError = APIError;
  static APIConnectionError = APIConnectionError;
  static APIConnectionTimeoutError = APIConnectionTimeoutError;
  static APIUserAbortError = APIUserAbortError;
  static NotFoundError = NotFoundError;
  static ConflictError = ConflictError;
  static RateLimitError = RateLimitError;
  static BadRequestError = BadRequestError;
  static AuthenticationError = AuthenticationError;
  static InternalServerError = InternalServerError;
  static PermissionDeniedError = PermissionDeniedError;
  static UnprocessableEntityError = UnprocessableEntityError;
}

export {
  DingtalkError,
  APIError,
  APIConnectionError,
  APIConnectionTimeoutError,
  APIUserAbortError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  BadRequestError,
  AuthenticationError,
  InternalServerError,
  PermissionDeniedError,
  UnprocessableEntityError,
};

export namespace Dingtalk {
  export import Robots = API.Robots;
  export import Files = API.Files;
}

export default Dingtalk;
