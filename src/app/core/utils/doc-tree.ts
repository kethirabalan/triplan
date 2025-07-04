import sortBy from './sort-by';
export type BuildConfig = {
    childMapping: { [key: string]: 'map' | 'skip' };
}

export const buildDocTree = (src: any[], buildConfig: BuildConfig): any[] => {

    const findParent = (obj: any, path: string): any => {
        const pts = path.split('/');

        let o = obj;
        let k = [];
        while (pts.length) {
            k.push(pts.shift());
            const tp = k.join('/');
            let t: any = null;
            if (Array.isArray(o)) {
                t = o.find(el => el._meta.path.endsWith(tp));
            } else {
                t = o[tp];
            }
            if (t) {
                o = t;
                k = [];
            }
        }
        return o;
    };

    const arr = [...src].sort(sortBy('$._meta.path'));

    let resp: any = {};

    for (const a of arr) {
        if (!a._meta) {
            continue;
        }
        const parts = a._meta.path.split('/');

        const hasParent = Object.keys(resp).find(key => {
            const keyParts = key.split('/');
            return parts.length > keyParts.length && a._meta.path.startsWith(key);
        });
        if (hasParent) {
            const id = parts.pop();
            const col = parts.pop();
            const parentPath = parts.join('/');

            const parent = findParent(resp, parentPath);

            if (buildConfig.childMapping && buildConfig.childMapping[col] === 'map') {
                parent[col] = parent[col] || {};
                parent[col][id] = { ...a };
            } else if (buildConfig.childMapping && buildConfig.childMapping[col] === 'skip') {
                resp[a._meta.path] = { ...a };
            } else {
                // array
                parent[col] = parent[col] || [];
                parent[col].push({ ...a });
            }
            resp[a._meta.path] = { ...a };
        } else {
            resp[a._meta.path] = { ...a };
        }

    }

    const response = Object.values(resp);


    return response;
};
