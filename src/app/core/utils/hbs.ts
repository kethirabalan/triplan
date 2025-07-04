import { Timestamp } from '@angular/fire/firestore';
// import * as HBS from 'handlebars/dist/cjs/handlebars';
import { Handlebars } from 'safe-handlebars';
const HBS: any = Handlebars;
import { timeDifference } from './relative-time';

import { JSONPath } from 'jsonpath-plus';
import { noValue } from './no-value';
import { transformObject } from './transform-object';
import sortBy from './sort-by';
import uniqueInArrayFilter, { uniqueInArrayBy } from './unique-in-array-filter';

export const age = (value: Date | Timestamp | number | string) => {
    if (!value) {
        return '';
    }

    let date: Date;
    if (typeof value === 'string') {
        if (Number.isNaN(Date.parse(value))) {
            return '';
        }
        date = new Date(value);
    } else if (typeof value === 'number') {
        date = new Date(value);
    } else if (typeof (value as Timestamp).toDate === 'function') {
        date = (value as Timestamp).toDate();
    } else {
        date = value as Date;
    }

    const relativeTime = timeDifference(date, 'old');

    return new HBS.SafeString(`${date.toISOString().substring(0, 16)}Z (${relativeTime})`);

};

export const ago = (value: Date | Timestamp | number | string) => {
    if (!value) {
        return '';
    }

    let date: Date;
    if (typeof value === 'string') {
        if (Number.isNaN(Date.parse(value))) {
            return '';
        }
        date = new Date(value);
    } else if (typeof value === 'number') {
        date = new Date(value);
    } else if (typeof (value as Timestamp).toDate === 'function') {
        date = (value as Timestamp).toDate();
    } else {
        date = value as Date;
    }

    const relativeTime = timeDifference(date, 'ago');

    return new HBS.SafeString(`${date.toISOString().substring(0, 16)}Z (${relativeTime})`);

}

export const breed = (animalOrbreed: any) => {
    let breedName = 'Unknown';
    const breed = animalOrbreed.breed || animalOrbreed;
    if (breed?.fci?.name || breed?.name) {
        breedName = breed?.fci?.name || breed?.name;
    }
    if (animalOrbreed.breedMix?.length) {
        const mix = animalOrbreed.breedMix
            .filter((b: any) => b.fci?.name || b.name)
            .map((b: any) => b.fci?.name || b.name)
            .join(', ');
        if (mix.length) {
            breedName += ` (${mix})`;
        }
    }
    return new HBS.SafeString(breedName);
}

export const jsvalue = (obj: any, path: string, toJson?: boolean, onlystrings?: boolean) => {
    if (!path) { return obj; }
    const value = JSONPath({ path, json: obj })[0];
    if (value === undefined) { return ''; }
    if (toJson) { return JSON.stringify(value); }
    if (onlystrings && typeof value !== 'string') { return ''; }
    return value;
};

export const rndChr = () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}


export const rnd = (arr: string[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const replaceAll = (str: string, search: string, replace: string) => {
    return str.replaceAll(search, replace);
}

export const keyValue = (obj: any) => {

    const jsonToText = (json: any, indent = 0): string => {
        let text = '';
        const indentStr = ' '.repeat(indent);
        const transform = (v: any) => {
            if (!noValue(v)) {
                if (v && (typeof v.collection === 'function' || typeof v.firestore === 'object')) {
                    return v.path || '';
                } else if (v && typeof v.toDate === 'function') {
                    return ago(v.toDate());
                } else {
                    return v;
                }
            } else {
                return '';
            }
        }
        if (Array.isArray(json)) {
            for (let i = 0; i < json.length; i++) {
                let item = transform(json[i]);
                text += `${indentStr}- ${jsonToText(item, indent + 2)}\n`;
            }
        } else if (typeof json === 'object') {
            const keys = Object.keys(json).sort();
            for (const key of keys) {
                if (key === '_meta') {
                    continue;
                }
                let item = transform(json[key]);
                const isValueType = typeof item !== 'object';
                const lb = isValueType ? '' : '\n';
                text += `${indentStr}${key}:${lb}${jsonToText(item, indent + 2)}\n`;
            }
        } else {
            text += `${indentStr}${json}`;
        }

        return text;
    }

    return jsonToText(obj);
}

export const sortAndUnique = (arr: any[], sort?: ['string', ('asc' | 'desc')], unique?: string, options?: any) => {
    let items = [...arr];
    if (sort) {
        items = items.sort(sortBy(...sort));
    }
    if (unique) {
        items = items.filter(uniqueInArrayBy(unique));
    }
    return options.fn({ items });

}

export const ifEquals = (a: any, b: any, options: any) => {
    if (a === b) {
        return options.fn(this);
    }
    return options.inverse(this);
}

export const eq = (obj: string | number, value: string | number) => {
    return obj === value;
}

// Serialize obj the right way
export const pickType = (obj: any): any => {
    if (typeof obj === 'undefined' || obj === null) {
        return '';
    } else if (['string', 'number', 'boolean'].some(el => el === typeof obj)) {
        return obj;
    } else if (obj.toISOString) {
        // It is a date
        return ago(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(el => pickType(el)).join(', ');
    } else if (typeof obj === 'object') {
        return keyValue(obj);
    }
}


export const compileWithExtensions = (tmp: string, ctx: Record<string, any> = {}) => {
    return hbs(tmp, {
        noEscape: true,
    })({
        ...ctx
    }, {
        helpers: {
            ago,
            age,
            breed,
            jsvalue,
            rndChr,
            rnd,
            keyValue,
            sortAndUnique,
            eq,
            pickType,
            replaceAll,
            ifEquals,
        },
    });
}

export const hbs = (str: string, options?: any) => HBS.compileAST(str, options);
