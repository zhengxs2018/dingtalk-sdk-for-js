/**
 * 自动加载运行时
 *
 * 警告：不要动这里的代码，除非你知道自己在做什么！
 */
const shims = require('./registry');
const auto = require('@zhengxs/dingtalk-event-hubs/_shims/auto/runtime');

if (!shims.kind) shims.setShims(auto.getRuntime());

for (const property of Object.keys(shims)) {
  Object.defineProperty(exports, property, {
    get() {
      return shims[property];
    },
  });
}
