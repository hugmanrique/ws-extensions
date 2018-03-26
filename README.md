# :cyclone: ws-extensions

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![license][license]][license-url]

`Sec-WebSocket-Extensions` header parser and serializer utils. This library aims to allow any WebSocket server implementation to parse the extensions supplied by the client decoupling the logic of parsing and checking the header value conforms to the ABNF specified in [Section 9.1](https://tools.ietf.org/html/rfc6455#section-9.1) of the [WebSocket Protocol RFC](https://tools.ietf.org/html/rfc6455).

## Getting Started

Install ws-extensions using [`npm`](https://www.npmjs.com/):

```bash
npm install --save @hugmanrique/ws-extensions
```

Or via [`yarn`](https://yarnpkg.com/en/package/@hugmanrique/ws-extensions):

```bash
yarn add @hugmanrique/ws-extensions
```

The minimum supported Node version is `v8.10.0`.

Let's get started by parsing a header:

```javascript
import { parse } from '@hugmanrique/ws-extensions';
const header = 'a; b=1';

// [ { name: 'a', params: { b: 1 } } ]
parse(header);
```

## Multiple complex offers support

`ws-extensions` supports duplicate offers or params:

```javascript
const header = 'a; b=1, c, b; d, c; e="hey, you"; e, a; b';

/*
[ { name: 'a', params: { b: 1 } },
  { name: 'c', params: {} },
  { name: 'b', params: { d: true } },
  { name: 'c', params: { e: ['hey, you', true] } },
  { name: 'a', params: { b: true } } ]
*/
parse(header);
```

## Methods

#### `parse(header)`

Parses the `Sec-WebSocket-Extensions` header into a JavaScript object.

* Returns an empty object if the header is empty.
* Throws a `SyntaxError` if the header is invalid.
* Unescapes data (numbers and flags get converted to JS primitives)
* Supports duplicate offers
* Supports duplicate params (converts the param value to an Array)

#### `serialize(name, params)`

Serializes the params of an offer.

## License

[MIT](LICENSE) &copy; [Hugo Manrique](https://hugmanrique.me)

[npm]: https://img.shields.io/npm/v/@hugmanrique/ws-extensions.svg
[npm-url]: https://npmjs.com/package/@hugmanrique/ws-extensions
[node]: https://img.shields.io/node/v/@hugmanrique/ws-extensions.svg
[node-url]: https://nodejs.org
[deps]: https://img.shields.io/david/hugmanrique/ws-extensions.svg
[deps-url]: https://david-dm.org/hugmanrique/ws-extensions
[tests]: https://img.shields.io/travis/hugmanrique/ws-extensions/master.svg
[tests-url]: https://travis-ci.org/hugmanrique/ws-extensions
[license-url]: LICENSE
[license]: https://img.shields.io/github/license/hugmanrique/ws-extensions.svg
[cover]: https://img.shields.io/coveralls/hugmanrique/ws-extensions.svg
[cover-url]: https://coveralls.io/r/hugmanrique/ws-extensions/
