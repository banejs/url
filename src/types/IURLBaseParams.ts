import IURLQuery from './IURLQuery';

export default interface IURLBaseParams {
    /**
     * The protocol scheme of the URL (e.g. "http:").
     */
    protocol: string;

    /**
     * Username of basic authentication.
     */
    username: string;

    /**
     * Password of basic authentication.
     */
    password: string;

    /**
     * Host name without port number.
     */
    hostname: string;

    /**
     * Optional port number.
     */
    port: number | null;

    /**
     * URL path.
     */
    pathname: string;

    /**
     * The parsed "query string" into object.
     */
    query: IURLQuery;

    /**
     * The "fragment" portion of the URL including the pound-sign ("#").
     */
    hash: string;

    /**
     * A boolean which indicates whether the protocol is followed by two forward slashes ("//").
     */
    slashes: boolean;
}
