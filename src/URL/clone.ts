import cloneDeep from 'lodash/cloneDeep';

import IURL from '../types/IURL';
import IURLParams from '../types/IURLParams';

import URL from './URL';

export default function clone(instance: IURL, params: Partial<IURLParams>): IURL {
    const newParams: Partial<IURLParams> = {
        protocol: instance.get('protocol'),
        username: instance.get('username'),
        password: instance.get('password'),
        hostname: instance.get('hostname'),
        port: instance.get('port'),
        pathname: instance.get('pathname'),
        hash: instance.get('hash'),
        slashes: instance.get('slashes'),
        ...params
    };

    if (typeof params.query !== 'undefined') {
        newParams.query = cloneDeep(params.query);
    } else if (typeof params.search !== 'undefined') {
        newParams.search = params.search;
    } else {
        newParams.query = cloneDeep(instance.get('query'));
    }

    return new URL(newParams);
}
