
import { noValue } from "./no-value";

const fskeys = {
    ref: '$r=',
    tsp: '$t='
};

export const transformObject = (obj: any, cb?: (v: any) => any, cleanNoValue = false) => {
    if (!obj) { return obj; }

    const fn = cb || (v => v);

    function t(value: any): any {
        if (Array.isArray(value)) {
            return value.map(t);
        } else if (typeof value === 'object') {
            if (value && value.constructor === {}.constructor) {
                return r(value, {});
            } else {
                return fn(value);
            }
        } else {
            return fn(value);
        }
    }

    function r(source: any, target: any) {
        Object.keys(source).forEach(key => {
            const value = source[key];
            const v = t(value);
            if (!cleanNoValue || !noValue(v)) {
                target[key] = t(value);
            }
        });
        return target;
    }

    const result = r(obj, {});
    return result;
};

