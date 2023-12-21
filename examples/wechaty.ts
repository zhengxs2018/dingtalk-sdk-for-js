import { PuppetDingTalk } from '@zhengxs/wechaty-puppet-dingtalk';
import { log, WechatyBuilder } from 'wechaty';

const puppet = new PuppetDingTalk({
  clientId: process.env.DINGTALK_CLIENT_ID,
  clientSecret: process.env.DINGTALK_CLIENT_SECRET,
});

const bot = WechatyBuilder.build({
  puppet,
});

bot.on('login', user => {
  log.info('StarterBot', '%s login', user);
});

bot.on('logout', user => {
  log.info('StarterBot', '%s logout', user);
});

bot.on('message', async msg => {
  log.info('StarterBot', msg.toString());

  const room = msg.room();
  if (room) {
    if (!(await msg.mentionSelf())) {
      console.log('被提及了');
    }

    await room.say('dong', msg.talker());

    // hack 解决 wechaty 无法发送 markdown 的问题
    await puppet.unstable__send(msg.id, {
      msgtype: 'markdown',
      markdown: {
        title: '测试',
        text: '## 这是 markdown 测试 \n [百度](https://www.baidu.com/)',
      },
    });
    return;
  }

  if (msg.type() === bot.Message.Type.Text) {
    await msg.say('dong');

    const urlLink = new msg.wechaty.UrlLink({
      title: '测试',
      description: '测试',
      url: 'https://www.baidu.com/',
      thumbnailUrl:
        'https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png',
    });

    await msg.say(urlLink);

    // hack 解决 wechaty 无法发送 markdown 的问题
    await puppet.unstable__send(msg.id, {
      msgtype: 'markdown',
      markdown: {
        title: '测试',
        text: '## 这是 markdown 测试 \n [百度](https://www.baidu.com/)',
      },
    });
  } else {
    await msg.say('不支持的消息类型');
  }
});

bot.start();
