/**
 * 自动加载运行时
 *
 * 警告：不要动这里的代码，除非你知道自己在做什么！
 */
import * as shims from './registry'
import * as auto from '@zhengxs/dingtalk-event-hubs/_shims/auto/runtime'

if (!shims.kind) shims.setShims(auto.getRuntime());

export * from './registry'
