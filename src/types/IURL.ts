import IURLParams from './IURLParams';
import IURLQuery from './IURLQuery';

interface IURL {
    /**
     * The full URL.
     */
    readonly href: string;

    /**
     * Generates a full URL.
     */
    toString(): string;

    get(
        paramName:
            | 'protocol'
            | 'username'
            | 'password'
            | 'hostname'
            | 'pathname'
            | 'hash'
            | 'host'
            | 'search'
            | 'href'
            | 'origin'
    ): string;
    get(paramName: 'port'): number | null;
    get(paramName: 'query'): IURLQuery;
    get(paramName: 'slashes'): boolean;
    get(paramName: keyof IURLParams | 'href' | 'origin'): IURLParams[keyof IURLParams];

    set(params: Partial<IURLParams>): IURL;
}

interface IURLConstructor {
    new (params: Partial<IURLParams>): IURL;

    parse(address: string): IURL;
}

declare const IURL: IURLConstructor;

export default IURL;
