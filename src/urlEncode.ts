/**
 * This function is convenient when encoding a string to be used in a query part of a URL, as a convenient way to pass
 * variables to the next page.
 *
 * @param str - The string to be encoded.
 */
export default function urlEncode(str: string): string {
    return encodeURIComponent(str).replace(
        /[!'()*]/g,
        (char: string): string => `%${char.charCodeAt(0).toString(16).toUpperCase()}`
    );
}
