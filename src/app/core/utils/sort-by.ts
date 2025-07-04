import { JSONPath } from 'jsonpath-plus'
import { noValue } from './no-value';
import { Timestamp } from '@angular/fire/firestore';
// path is jsonpath string or null
export default (path?: string, dir: ('asc' | 'desc') = 'asc', m = '') => {
    // m contains i = case insensitive;
    let caseInsensitive = false;
    if (m.indexOf('i') > -1) {
        caseInsensitive = true;
    }
    return (a: any, b: any) => {
        if (!path) {
            let aa = a;
            let bb = b;
            if (caseInsensitive && typeof a === 'string') {
                aa = a.toLowerCase();
                bb = b.toLowerCase();
            }
            if (a > b) {
                return dir === 'asc' ? 1 : -1;
            }
            if (a < b) {
                return dir === 'asc' ? -1 : 1;
            }
            return 0;
        }
        let aa = JSONPath({ path, json: a })[0];
        let bb = JSONPath({ path, json: b })[0];
        //
        if (aa && noValue(bb)) {
            return dir === 'asc' ? -1 : 1;
        } else if (noValue(aa) && bb) {
            return dir === 'asc' ? 1 : -1;
        } else if (noValue(aa) && noValue(bb)) {
            return 0;
        }
        //
        if (caseInsensitive && typeof aa === 'string') {
            aa = aa.toLowerCase();
            bb = bb.toLowerCase();
        }
        if (aa instanceof Timestamp) {
            aa = aa.toString();
        }
        if (bb instanceof Timestamp) {
            bb = bb.toString();
        }
        if (aa > bb) {
            return dir === 'asc' ? 1 : -1;
        } else if (aa < bb) {
            return dir === 'asc' ? -1 : 1;
        } else {
            return 0;
        }
    };
};

