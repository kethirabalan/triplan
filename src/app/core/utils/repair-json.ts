import { jsonrepair } from 'jsonrepair';
// import path2obj from './path2obj';

const stripExtraCharacters = (text: string): string => {
    const re = /(\[.*\]|\{.*\})/s;
    const match = text.match(re);
    return match ? match[0] : '';
};



export default (text: string): any => {
    let temp: any;

    text = stripExtraCharacters(text);

    try {
        temp = JSON.parse(text);
    } catch (error) {
        temp = JSON.parse(jsonrepair(text));
    }
    return JSON.stringify(temp);
    // check for properties stating with a $.

}