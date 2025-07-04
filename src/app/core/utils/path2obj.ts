export default (jsonPath: string, value: any): any => {
    // remove '$.' from the start of the path
    jsonPath = jsonPath.replace(/^\$\./, '');

    // write a regex finds all words that are not followed by a dot nad finds words that are wrapped in brackets[]
    // some.things[0].else should be split to ['some', 'things', [0], 'else']
    const parts = jsonPath.match(/(\w+|\[\d\])/g) || [];

    // initialize the result as the value
    let result = value;

    // starting from the end, wrap the result in an object or array
    for (let i = parts.length - 1; i >= 0; i--) {
        // if the part is like '[number]', then it's an array
        if (/\[\d\]/.test(parts[i])) {
            const newArray: any[] = [];
            // get the index from the part

            const index = Number(parts[i].match(/\d/)?.[0]);
            // fill the array with null values up to the index
            for (let j = 0; j < index; j++) {
                newArray.push(null);
            }
            // set the value at the index
            newArray.push(result);

            // set the result as the new array
            result = newArray;
        } else {
            // it's an object
            const newObj: any = {};
            newObj[parts[i]] = result;
            result = newObj;
        }
    }

    return result;
}