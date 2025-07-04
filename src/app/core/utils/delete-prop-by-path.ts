import { JSONPath } from 'jsonpath-plus';

export default (obj: any, path: string, value: any): boolean => {
    const nodes = JSONPath({ path, json: obj, resultType: 'all' });

    // If the path doesn't exist or match any nodes, we can't set the value.
    if (nodes.length === 0) {
        return false;
    }

    // Set the value for each matching node
    nodes.forEach((node: any) => {
        const parent = node.path.slice(0, -1).reduce((acc: any, key: any) => {
            if (key === '$') {
                return acc;
            }
            return acc[key];
        }, obj);
        const key = node.path[node.path.length - 1];
        parent[key] = value;
    });
    return true;
}