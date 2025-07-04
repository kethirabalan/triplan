let unicodeChars: string[] = [' ']
// write an array of ascii upper and lower case characters
for (let i = 65; i <= 122; i++) {
    unicodeChars.push(String.fromCharCode(i));
}


export const obfuscate = (text: string, n: number): string => {
    if (!text) {
        return '';
    }
    // Replace random characters
    let result = '';
    const l = n > text.length ? text.length : n;
    for (let i = 0; i < l; i++) {
        if (Math.random() < 1) { // 10% chance to replace a character
            const randomChar = unicodeChars[Math.floor(Math.random() * unicodeChars.length)];
            result += randomChar;
        } else {
            result += text[i];
        }
    }

    return result + text.slice(l);
}

export const trnReveal = (text: string, cover: string, m: number, d: number = 0): string => {
    if (!text) {
        return '';
    }

    const k = 1;

    let n = m - d;
    if (n < 0) {
        n = 0;
    }

    const startIndex = n > k ? n - k : 0;
    const endIndex = n;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const obf = (t: string) => {
        // replace all characters with random characters
        return t.split('').map(c => {
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
    }
    if (endIndex > text.length) {
        return cover;
    }

    const result = cover.slice(0, startIndex) + obf(text.slice(startIndex, endIndex)) + text.slice(endIndex);
    return result;
}



// Write an arrow function that takes three input parameters. text: string, cover: string, n: number. where n is the current position of the reveal. the position of n and the three previous character should be obfuscated with random characters. before them should be the "cover" revealed fter them should the rmaining "text".

