import { JSONPath } from 'jsonpath-plus';

interface ArrayCompareResponse {
    isEqual: boolean;
    common: any[];
    onlyInA: any[];
    onlyInB: any[];
}

// path is a jsonpath
export default (a: any[], b: any[], path?: string, caseInsensitive: boolean = false): ArrayCompareResponse => {

    const resp: ArrayCompareResponse = {
        isEqual: false,
        common: [],
        onlyInA: [],
        onlyInB: []
    };

    const transform = (v: any) => (!caseInsensitive || typeof v !== 'string') ? v : v.toLowerCase();

    if (!path) {
        resp.common = a.filter(A => b.filter(B => transform(A) === transform(B)).length);

        resp.onlyInA = a.filter(A => !b.filter(B => transform(A) === transform(B)).length);

        resp.onlyInB = b.filter(B => !a.filter(A => transform(A) === transform(B)).length);
    } else {
        resp.common = a.filter(A => b.filter(B => transform(JSONPath({ path, json: A })[0]) === transform(JSONPath({ path, json: B })[0])).length);

        resp.onlyInA = a.filter(A => !b.filter(B => transform(JSONPath({ path, json: A })[0]) === transform(JSONPath({ path, json: B })[0])).length);

        resp.onlyInB = b.filter(B => !a.filter(A => transform(JSONPath({ path, json: A })[0]) === transform(JSONPath({ path, json: B })[0])).length);
    }

    resp.isEqual = a.length === b.length && a.length === resp.common.length;

    return resp;
};
