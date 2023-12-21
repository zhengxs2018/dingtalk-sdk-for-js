import { APIError } from '@zhengxs/http';

/**
 * 断言错误码为 0
 *
 * @see https://open.dingtalk.com/document/orgapp/server-api-error-codes-1
 * @see https://open.dingtalk.com/document/orgapp/error-code
 *
 * @param json - JSON 响应
 */
export function assertErrCodeOfZero(json?: Record<string, any>): void {
  if (!json) return;

  const code = json.errcode ?? json.errorcode ?? 0;

  if (code === 0) return;

  const message = json.errmsg ?? json.errormessage ?? 'Unknown error';

  const error = { code, message };

  throw APIError.generate(undefined, { error }, undefined, undefined);
}
