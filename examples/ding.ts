import { PuppetDingTalk } from '@zhengxs/wechaty-puppet-dingtalk';
import { WechatyBuilder } from 'wechaty';

const bot = WechatyBuilder.build({
  puppet: new PuppetDingTalk({
    clientId: process.env.DINGTALK_CLIENT_ID,
    clientSecret: process.env.DINGTALK_CLIENT_SECRET,
  }),
});

bot.on('message', async msg => {
  // 发送文本消息
  await msg.say('dong');

  // 支持群聊
  const room = msg.room();

  if (room) {
    // 发送文本消息并且 @ 发送者
    await room.say('dong', msg.talker());
  }
});

bot.start();
