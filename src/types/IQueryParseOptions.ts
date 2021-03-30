export default interface IQueryParseOptions {
    decoder?: (str: string) => string;
    strictNullHandling?: boolean;
}
