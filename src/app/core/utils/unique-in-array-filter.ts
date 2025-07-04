import { JSONPath } from 'jsonpath-plus';

export default function uniqueInArrayFilter(value: any, index: number, self: any[]) {
    return self.indexOf(value) === index;
}

export const uniqueInArrayBy = (prop: string) => (el: any, ix: number, self: any[]) => {
    const value = JSONPath({ path: prop, json: el })[0];
    const ex = self.findIndex(A => (JSONPath({ path: prop, json: A })[0] === value));
    return ex === ix;
};
