import { type MarkdownMessagePayload } from '@zhengxs/wechaty-puppet-dingtalk';
import { UrlLinkImpl } from 'wechaty/impls';

// hack 解决 钉钉的消息类型，wechaty 不支持的问题
export class WechatifiedMarkdown extends UrlLinkImpl {
  constructor(payload: MarkdownMessagePayload['markdown']) {
    // @ts-expect-error
    super({ msgtype: 'markdown', markdown: payload });
  }
}
