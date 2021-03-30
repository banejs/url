import IURLQuery from '../types/IURLQuery';
import IURL from '../types/IURL';
import IURLParams from '../types/IURLParams';

import { PORT_REGEXP } from '../constants/portRegexp';

import queryStringify from '../queryStringify';
import queryParse from '../queryParse';
import clone from './clone';
import parse from './parse';

export default class URL implements IURL {
    /**
     * The protocol scheme of the URL (e.g. "http:").
     */
    protected protocol: string = '';

    /**
     * Username of basic authentication.
     */
    protected username: string = '';

    /**
     * Password of basic authentication.
     */
    protected password: string = '';

    /**
     * Host name without port number.
     */
    protected hostname: string = '';

    /**
     * Optional port number.
     */
    protected port: number | null = null;

    /**
     * URL path.
     */
    protected pathname: string = '';

    /**
     * The parsed "query string" into object.
     */
    protected query: IURLQuery = {};

    /**
     * The "fragment" portion of the URL including the pound-sign ("#").
     */
    protected hash: string = '';

    /**
     * A boolean which indicates whether the protocol is followed by two forward slashes ("//").
     */
    protected slashes: boolean = false;

    public constructor(params?: Partial<IURLParams>) {
        if (typeof params !== 'undefined') {
            (Object.keys(params) as Array<keyof IURLParams>).forEach((paramName: keyof IURLParams): void => {
                const value: IURLParams[keyof IURLParams] | undefined = params[paramName];

                if (typeof value !== 'undefined') {
                    // @ts-ignore Игнорируем ошибку приведения типов, потому что ее никогда тут не может быть. Тайпскрипт глуповат для этого.
                    this[paramName] = value;
                }
            });
        }
    }

    /**
     * Host name with port number.
     */
    protected get host(): string {
        if (this.port !== null) {
            return `${this.hostname}:${this.port}`;
        }

        return this.hostname;
    }

    /**
     * Set host.
     */
    protected set host(host: string) {
        const match: RegExpExecArray | null = PORT_REGEXP.exec(host);

        if (match) {
            this.port = Number(match[1]);
            this.hostname = host.slice(0, match.index);
        } else {
            this.port = null;
            this.hostname = host;
        }
    }

    /**
     * The "query string" including the question sign ("?").
     */
    protected get search(): string {
        if (Object.keys(this.query).length === 0) {
            return '';
        }

        return `?${queryStringify(this.query)}`;
    }

    /**
     * Set "query string".
     */
    protected set search(search: string) {
        this.query = queryParse(search);
    }

    protected get origin(): string {
        if (this.host && this.protocol !== 'file:') {
            return `${this.protocol}//${this.host}`;
        }

        return '';
    }

    public get(
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
    public get(paramName: 'port'): number | null;
    public get(paramName: 'query'): IURLQuery;
    public get(paramName: 'slashes'): boolean;
    public get(paramName: keyof IURLParams | 'href' | 'origin'): IURLParams[keyof IURLParams] {
        return this[paramName];
    }

    public set(params: Partial<IURLParams>): IURL {
        return clone(this, params);
    }

    /**
     * The full URL.
     */
    public get href(): string {
        return this.toString();
    }

    /**
     * Transform the properties back in to a valid and full URL string.
     */
    public toString(): string {
        let result: string = '';
        let protocol: string = this.protocol;

        if (protocol && protocol.charAt(protocol.length - 1) !== ':') {
            protocol += ':';
        }

        result += protocol + (this.slashes ? '//' : '');

        if (this.username) {
            result += this.username;

            if (this.password) {
                result += `:${this.password}`;
            }

            result += '@';
        }

        result += this.host + this.pathname;

        if (this.host && !this.pathname && (this.search || this.hash)) {
            result += '/';
        }

        if (this.search) {
            result += this.search;
        }

        if (this.hash) {
            result += this.hash.charAt(0) !== '#' ? `#${this.hash}` : this.hash;
        }

        return result;
    }

    /**
     * Parse address.
     */
    public static parse(address: string): IURL {
        return new URL(parse(address));
    }
}
