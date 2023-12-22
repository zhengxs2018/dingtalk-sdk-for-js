import { type ActionCardMessagePayload } from '@zhengxs/wechaty-puppet-dingtalk';
import { UrlLinkImpl } from 'wechaty/impls';

// hack 解决 钉钉的消息类型，wechaty 不支持的问题
class WechatifiedActionCard extends UrlLinkImpl {
  constructor(payload: ActionCardMessagePayload['actionCard']) {
    // @ts-expect-error
    super({ msgtype: 'actionCard', actionCard: payload });
  }
}

export { WechatifiedActionCard as ActionCard };
