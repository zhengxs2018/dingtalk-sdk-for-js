# @zhengxs/dingtalk-auth

> WIP

## 安装

```sh
# With PNPM
$ pnpm add @zhengxs/dingtalk-auth
```

## 示例

```ts
import { AuthCredential } from '@zhengxs/dingtalk-auth';

const credential = new AuthCredential({
  clientId: process.env.DINGTALK_CLIENT_ID,
  clientSecret: process.env.DINGTALK_CLIENT_SECRET,
});

// 获取授权令牌
await credential.getToken();
//=> { accessToken: '...' }
```

## License

MIT
