export const mergeObj = (a: any, b: any): any => {
    const merged = JSON.parse(JSON.stringify(a));

    for (const key in b) {

        if (merged && typeof merged === 'object') {
            // eslint-disable-next-line no-prototype-builtins
            if (merged.hasOwnProperty(key)) {
                if (typeof b[key].firestore == 'object' && b[key].path) {
                    merged[key] = b[key];
                } else if (typeof merged[key] === 'object' && typeof b[key] === 'object') {
                    if (merged[key] && b[key]) {
                        merged[key] = mergeObj(merged[key], b[key]);
                    } else if (!merged[key] && b[key]) {
                        merged[key] = b[key];
                    } else {
                        // merged[key] = merged[key];
                    }
                } else {
                    merged[key] = b[key];
                }
            } else {
                merged[key] = b[key];
            }
        }
    }

    return merged;
}