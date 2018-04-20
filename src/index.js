/* eslint-disable no-control-regex */

const TOKEN = /([\w!#$%&'*+\-.^`|~]+)/;
// Control characters aren't allowed
const QUOTED = /"((?:\\[\x00-\x7f]|[^\x00-\x08\x0a-\x1f\x7f"])*)"/;

const PARAM = new RegExp(
  `${TOKEN.source}(?:=(?:${TOKEN.source}|${QUOTED.source}))?`
);
const PARAM_G = new RegExp(PARAM.source, 'g');

const EXTENSION = new RegExp(`${TOKEN.source}(?: *; *${PARAM.source})*`, 'g');
const EXTENSION_LIST = new RegExp(
  `^${EXTENSION.source}(?: *, *${EXTENSION.source})*$`
);

const NUMBER = /^(0|[1-9][0-9]*)+(\.[0-9]+)?$/;

/**
 * Parses the "Sec-WebSocket-Extensions" header into an object.
 * @param {String} header The header field value
 * @return {Object} The parsed extension map
 */
export function parse(header) {
  const offers = [];

  if (!header) {
    return offers;
  }

  if (!EXTENSION_LIST.test(header)) {
    throw new SyntaxError(`Invalid header: ${header}`);
  }

  const values = header.match(EXTENSION);

  for (const value of values) {
    const params = value.match(PARAM_G);
    const name = params.shift();
    const offer = {};

    for (const param of params) {
      const args = param.match(PARAM);
      const key = args[1];
      let data;

      if (args[2]) {
        data = args[2];
      } else if (args[3]) {
        // Unescape data
        data = args[3].replace(/\\/g, '');
      } else {
        data = true;
      }

      if (NUMBER.test(data)) {
        data = parseFloat(data);
      }

      if (offer.hasOwnProperty(key)) {
        const newArgs = [...offer[key], data];

        offer[key] = newArgs;
      } else {
        offer[key] = data;
      }
    }

    offers.push({
      name,
      params: offer
    });
  }

  return offers;
}

/**
 * Serializes the params of an offer
 * @param {String} The name of the parameter
 * @param {(Object|Map)} The params of the offer
 * @return {String} A string representing the given object
 */
export function serialize(name, params) {
  const values = [name];

  const print = (key, value) => {
    if (value instanceof Array) {
      value.forEach(elem => print(key, elem));
    } else if (value === true) {
      values.push(key);
    } else if (typeof value === 'string' && value.includes('"')) {
      print(key, value.replace('"', ''));
    }

    values.push(`${key}=${value}`);
  };

  if (params instanceof Map) {
    for (const [key, value] of params) {
      print(key, value);
    }
  } else {
    // Assume it's an object
    Object.keys(params).forEach(key => {
      print(key, params[key]);
    });
  }

  return values.join('; ');
}
