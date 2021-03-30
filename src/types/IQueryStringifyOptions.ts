export default interface IQueryStringifyOptions {
    encode?: boolean;
    encoder?: (str: string) => string;
    arrayFormat?: 'indices' | 'brackets' | 'repeat';
    strictNullHandling?: boolean;
}
