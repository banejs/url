import { IParseOptions, parse } from 'qs';

import IQueryParseOptions from './types/IQueryParseOptions';
import IURLQuery from './types/IURLQuery';

import urlDecode from './urlDecode';

export default function queryParse(query: string, options: IQueryParseOptions = {}): IURLQuery {
    const qsOptions: IParseOptions = {
        decoder: options.decoder || urlDecode,
        strictNullHandling:
            Object.prototype.toString.call(options.strictNullHandling) === '[object Boolean]'
                ? options.strictNullHandling
                : true
    };

    return parse(query, qsOptions) as IURLQuery;
}
