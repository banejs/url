import IURL from './types/IURL';

import URL from './URL/URL';

export default function parseUrl(url: string): IURL {
    return URL.parse(url);
}
