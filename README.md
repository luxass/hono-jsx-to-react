# hono-jsx-to-react

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![jsr version][jsr-version-src]][jsr-version-href]

## 📦 Installation

```sh
npm install hono-jsx-to-react hono
```

## 📚 Usage

```tsx
import { toReactNode } from "hono-jsx-to-react";

const element = <div> Hello World! </div>
console.log(toReactNode(element));
// {
//   type: "div",
//   key: null,
//   props: {
//     children: "Hello World!"
//   },
// }
```

## 📄 License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/hono-jsx-to-react?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/hono-jsx-to-react
[npm-downloads-src]: https://img.shields.io/npm/dm/hono-jsx-to-react?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/hono-jsx-to-react
[jsr-version-src]: https://jsr.io/badges/@luxass/hono-jsx-to-react?style=flat&labelColor=18181B&logoColor=4169E1
[jsr-version-href]: https://jsr.io/@luxass/hono-jsx-to-react
