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
  } else {
    await msg.say('不支持的消息类型');
  }
});

bot.start();
