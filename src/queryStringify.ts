import { IStringifyOptions, stringify } from 'qs';

import IURLQuery from './types/IURLQuery';
import IQueryStringifyOptions from './types/IQueryStringifyOptions';

import urlEncode from './urlEncode';

export default function queryStringify(query: IURLQuery, options: IQueryStringifyOptions = {}): string {
    const qsOptions: IStringifyOptions = {
        encode: Object.prototype.toString.call(options.encode) === '[object Boolean]' ? options.encode : true,
        encoder: options.encoder || urlEncode,
        encodeValuesOnly: true,
        arrayFormat: options.arrayFormat || 'repeat',
        strictNullHandling:
            Object.prototype.toString.call(options.strictNullHandling) === '[object Boolean]'
                ? options.strictNullHandling
                : true
    };

    return stringify(query, qsOptions);
}
