# @zhengxs/dingtalk-event-hubs

## 安装

```sh
# With PNPM
$ pnpm add @zhengxs/dingtalk-auth @zhengxs/dingtalk-event-hubs
```

## 示例

```ts
import { AuthCredential } from '@zhengxs/dingtalk-auth';
import { HubConnectionBuilder } from '@zhengxs/dingtalk-event-hubs';

async function main() {
  const credential = new AuthCredential({
    clientId: process.env.DINGTALK_CLIENT_ID,
    clientSecret: process.env.DINGTALK_CLIENT_SECRET,
  });

  const connection = new HubConnectionBuilder()
    .withCredential(credential)
    .build();

  connection.on('message', function (payload) {
    console.log(data);
  });

  await connection.start();
}

main();
```
