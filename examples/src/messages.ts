import { ActionCard, FeedCard, Markdown } from '@zhengxs/wechaty-dingtalk-message';
import { PuppetDingTalk } from '@zhengxs/wechaty-puppet-dingtalk';
import { log, WechatyBuilder } from 'wechaty';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const bot = WechatyBuilder.build({
  puppet: new PuppetDingTalk({
    clientId: process.env.DINGTALK_CLIENT_ID,
    clientSecret: process.env.DINGTALK_CLIENT_SECRET,
  }),
});

bot.on('login', user => {
  log.info('StarterBot', '%s login', user);
});

bot.on('logout', user => {
  log.info('StarterBot', '%s logout', user);
});

bot.on('message', async msg => {
  const room = msg.room();
  const talker = msg.talker();

  const reply = sayable => {
    if (room) {
      return room.say(sayable, talker);
    }

    return msg.say(sayable);
  };

  // msg.wechaty === bot
  const { Message, UrlLink } = msg.wechaty;

  switch (msg.type()) {
    case Message.Type.Text: {
      // 文本消息
      await reply('dong');

      await sleep(300);

      // 发送链接
      await reply(
        new UrlLink({
          title: '测试',
          description: '这是一个Link消息',
          url: 'https://open.dingtalk.com/document/',
          thumbnailUrl: 'https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png',
        }),
      );

      await sleep(300);

      // 发送 markdown
      await reply(
        new Markdown({
          title: '测试',
          text: '## 这是 markdown 测试 \n [百度](https://www.baidu.com/)',
        }),
      );

      await sleep(300);

      // 整体跳转 ActionCard 类型
      await reply(
        new ActionCard({
          title: '打造一间咖啡厅',
          text: '![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png) \n #### 乔布斯 20 年前想打造的苹果咖啡厅 \n\n Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划',
          singleTitle: '阅读全文',
          singleURL: 'https://www.dingtalk.com/',
        }),
      );

      await sleep(300);

      // 独立跳转 ActionCard 类型
      await reply(
        new ActionCard({
          title: '乔布斯 20 年前想打造一间苹果咖啡厅，而它正是 Apple Store 的前身',
          text: '![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png) \n\n #### 乔布斯 20 年前想打造的苹果咖啡厅 \n\n Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划',
          btnOrientation: '0',
          btns: [
            {
              title: '内容不错',
              actionURL: 'https://www.dingtalk.com/',
            },
            {
              title: '不感兴趣',
              actionURL: 'https://www.dingtalk.com/',
            },
          ],
        }),
      );

      await sleep(300);

      // 发送 FeedCard
      await reply(
        new FeedCard({
          links: [
            {
              title: '时代的火车向前开1',
              messageURL: 'https://www.dingtalk.com/',
              picURL: 'https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png',
            },
            {
              title: '时代的火车向前开2',
              messageURL: 'https://www.dingtalk.com/',
              picURL: 'https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png',
            },
          ],
        }),
      );
      break;
    }

    default:
      await reply('不支持的消息类型');
  }
});

bot.start();
