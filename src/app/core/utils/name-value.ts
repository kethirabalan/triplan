import { JSONPath } from 'jsonpath-plus';

export default (obj: any, keys: Record<string, string>): string => {
    let resp = '';
    for (const key in keys) {
        const keyString = keys[key];
        if (keyString.charAt(0) === '$') {
            const v = JSONPath({ path: keyString, json: obj })[0];
            if (v) {
                resp += `${key}: ${v.toString()}\n`;
            }
        } else {
            if (obj[keyString]) {
                resp += `${key}: ${obj[keyString].toString()}\n`;
            }
        }
    }
    return resp;
}
