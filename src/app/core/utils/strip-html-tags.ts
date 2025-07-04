export const stripHtmlTags = (text: string): string => {
    // Regular expression to match HTML tags
    const htmlTagPattern: RegExp = /<.*?>/g;

    // Replace HTML tags with an empty string
    const cleanText: string = text.replace(htmlTagPattern, '');

    return cleanText;
}

// 