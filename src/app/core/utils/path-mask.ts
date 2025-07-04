


type PathMaskResult = {
    isMatching: boolean;
    colMatching: boolean;
    params: { [key: string]: string };
    parts: string[];
}



export const normalizePath = (path: string): string => {
    // remove / in the beginning and end of the path if exist
    path = path.replace(/^\/|\/$/g, '');
    return path;
}

export const pathMask = (path: string, mask: string): PathMaskResult => {
    const result: PathMaskResult = {
        isMatching: true,
        colMatching: false,
        params: {},
        parts: path.split('/')
    };
    const pathParts = path.split('/');
    const maskParts = mask.split('/');

    const regex = /{([^}]+)}/g;

    for (let i = 0; i < maskParts.length; i++) {
        const mp = maskParts[i];
        const pp = pathParts[i];

        const match = mp.match(regex);
        if (match?.[0]) {
            const key = match[0]
                .substring(1, match[0].length - 1)
                .trim();
            result.params[key] = pp;
        } else {
            if (mp !== pp) {
                result.isMatching = false;
            }
        }
    }
    if (pathParts.length !== maskParts.length) {
        result.isMatching = false;
    }

    result.params.source = path;
    result.params.root = path.split('/').splice(0, 2).join('/');

    // Set result.sameCollection if the path is a document and the parent collection is mathcing with the mask
    if (pathParts.length % 2 === 0) {
        const parentCollectionPath = path.split('/').slice(0, -1).join('/');
        result.colMatching = pathMask(parentCollectionPath, mask).isMatching;
    } else {
        result.colMatching = result.isMatching;
    }




    return result;
}


export const buildPath = (path: string, params: { [key: string]: string }): string => {
    const regex = /{([^}]+)}/g;
    let result = path;
    const match = path.match(regex) || [];
    for (const m of match) {
        const key = m
            .substring(1, m.length - 1)
            .trim();
        result = result.replace(m, params[key]);
    }

    return result;
}


export const makeMask = (path: string) => {
    const pp = path.split('/');
    const mask = [];
    for (let i = 0; i < pp.length; i++) {
        const isdoc = (i + 1) % 2 === 0;
        const n = Math.floor(i / 2);
        mask.push(isdoc ? `{docId${n}}` : `{colId${n}}`)
    }
    return mask.join('/');
}