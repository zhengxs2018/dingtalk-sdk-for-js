import { PuppetDingTalk } from '@zhengxs/wechaty-puppet-dingtalk';
import { FileBox } from 'file-box';
import { WechatyBuilder } from 'wechaty';


const puppet = new PuppetDingTalk({
  clientId: process.env.DINGTALK_CLIENT_ID,
  clientSecret: process.env.DINGTALK_CLIENT_SECRET,
})

const bot = WechatyBuilder.build({
  puppet
});

bot.on('message', async msg => {
  const MessageTypes = bot.Message.Type;

  switch (msg.type()) {
    case MessageTypes.Text: {
      if (msg.text() === 'ding') {
        await msg.say('dong')
        return
      }

      await msg.say(FileBox.fromUrl('https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png'));

      break;
    }

    default:
      await msg.say(`unhandled message: ${msg.toString()}`);
  }
});

bot.start();
