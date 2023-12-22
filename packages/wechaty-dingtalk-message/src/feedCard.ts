import { type FeedCardMessagePayload } from '@zhengxs/wechaty-puppet-dingtalk';
import { UrlLinkImpl } from 'wechaty/impls';

// hack 解决 钉钉的消息类型，wechaty 不支持的问题
class WechatifiedFeedCard extends UrlLinkImpl {
  constructor(payload: FeedCardMessagePayload['feedCard']) {
    // @ts-expect-error
    super({ msgtype: 'feedCard', feedCard: payload });
  }
}

export { WechatifiedFeedCard as FeedCard };
