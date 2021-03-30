import IURLBaseParams from './IURLBaseParams';

export default interface IURLParams extends IURLBaseParams {
    /**
     * Host name with port number.
     */
    host: string;

    /**
     * The "query string" including the question sign ("?").
     */
    search: string;
}
