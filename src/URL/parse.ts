import IURLQuery from '../types/IURLQuery';
import IURLBaseParams from '../types/IURLBaseParams';

import { PORT_REGEXP } from '../constants/portRegexp';
import { PROTOCOL_REGEXP } from '../constants/protocolRegexp';

import queryParse from '../queryParse';

export default function parse(address: string): IURLBaseParams {
    const {
        protocol,
        slashes,
        rest: restProtocol
    }: {
        protocol: string;
        slashes: boolean;
        rest: string;
    } = extractProtocol(address);
    const {
        hash,
        rest: restHash
    }: {
        hash: string;
        rest: string;
    } = extractHash(restProtocol);
    const {
        query,
        rest: restQuery
    }: {
        query: IURLQuery;
        rest: string;
    } = extractQuery(restHash);
    const {
        pathname,
        rest: restPathname
    }: {
        pathname: string;
        rest: string;
    } = extractPathname(restQuery, slashes, protocol);
    const {
        username,
        password,
        rest: restAuth
    }: {
        username: string;
        password: string;
        rest: string;
    } = extractAuth(restPathname);
    const {
        port,
        rest: restPort
    }: {
        port: number | null;
        rest: string;
    } = extractPort(restAuth);

    /**
     * We should not add port numbers if they are already the default port number
     * for a given protocol. As the host also contains the port number we're going
     * override it with the hostname which contains no port number.
     */
    const portRequired: boolean = isPortRequired(port, protocol);

    return {
        protocol,
        slashes,
        hash,
        query,
        pathname,
        username,
        password,
        port: portRequired ? port : null,
        hostname: restPort
    };
}

function extractProtocol(
    rest: string
): {
    protocol: string;
    slashes: boolean;
    rest: string;
} {
    const match: RegExpExecArray | null = PROTOCOL_REGEXP.exec(rest);

    return {
        protocol: match && match[1] ? match[1].toLowerCase() : '',
        slashes: match ? Boolean(match[2]) : false,
        rest: match ? match[3] : rest
    };
}

function extractHash(
    rest: string
): {
    hash: string;
    rest: string;
} {
    const index: number = rest.indexOf('#');

    return {
        hash: index > -1 ? rest.slice(index) : '',
        rest: index > -1 ? rest.slice(0, index) : rest
    };
}

function extractQuery(
    rest: string
): {
    query: IURLQuery;
    rest: string;
} {
    const index: number = rest.indexOf('?');

    return {
        query: index > -1 ? queryParse(rest.slice(index + 1)) : {},
        rest: index > -1 ? rest.slice(0, index) : rest
    };
}

function extractPathname(
    rest: string,
    slashes: boolean,
    protocol: string
): {
    pathname: string;
    rest: string;
} {
    /**
     * When the authority component is absent the URL starts with a path component.
     */
    if (!slashes || protocol === 'file:') {
        return {
            pathname: rest,
            rest: ''
        };
    }

    const index: number = rest.indexOf('/');

    /**
     * Required for consistency when parsing values like "http://example.com/" and "http://example.com".
     */
    let pathname: string = '/';

    if (index > 0) {
        pathname = rest.slice(index);
    }

    return {
        pathname,
        rest: index > 0 ? rest.slice(0, index) : rest
    };
}

function extractAuth(
    rest: string
): {
    username: string;
    password: string;
    rest: string;
} {
    const index: number = rest.indexOf('@');

    if (index > -1) {
        const auth: string = rest.slice(0, index);
        const [username, password = '']: Array<string> = auth.split(':');

        return {
            username,
            password,
            rest: rest.slice(index + 1)
        };
    }

    return {
        username: '',
        password: '',
        rest
    };
}

function extractPort(
    rest: string
): {
    port: number | null;
    rest: string;
} {
    const match: RegExpExecArray | null = PORT_REGEXP.exec(rest);

    return {
        port: match ? Number(match[1]) : null,
        rest: match ? rest.slice(0, match.index) : rest
    };
}

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 *
 * @param port - Port number we need to check.
 * @param protocol - Protocol we need to check against.
 *
 * @return Is it a default port for the given protocol.
 */
function isPortRequired(port: number | null, protocol: string): boolean {
    if (!port) {
        return false;
    }

    switch (protocol) {
        case 'http:':
        case 'ws:':
            return port !== 80;

        case 'https:':
        case 'wss:':
            return port !== 443;

        case 'ftp:':
            return port !== 21;

        default:
            return port !== 0;
    }
}
