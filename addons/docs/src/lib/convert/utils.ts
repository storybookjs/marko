const QUOTE_REGEX = /^['"]|['"]$/g;
export const trimQuotes = (str: string) => str.replace(QUOTE_REGEX, '');
