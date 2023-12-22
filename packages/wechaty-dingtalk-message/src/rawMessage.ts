import { type MessagePayload } from '@zhengxs/wechaty-puppet-dingtalk';
import { UrlLinkImpl } from 'wechaty/impls';

// hack 解决 钉钉的消息类型，wechaty 不支持的问题
class WechatifiedRawMessage extends UrlLinkImpl {
  constructor(payload: MessagePayload) {
    // @ts-expect-error
    super(payload);
  }
}

export { WechatifiedRawMessage as RawMessage };
