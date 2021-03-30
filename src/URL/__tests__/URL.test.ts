import IURL from '../../types/IURL';

import URL from '../URL';

describe('URL', (): void => {
    test('instances is not same', (): void => {
        const location1: IURL = URL.parse('http://example.com');
        const location2: IURL = location1.set({
            pathname: 'foo'
        });

        expect(location1).not.toBe(location2);
    });

    test('queries is not equal', (): void => {
        const location1: IURL = URL.parse('http://example.com');
        const location2: IURL = location1.set({
            query: {
                foo: 'bar'
            }
        });

        expect(location1.get('query')).not.toBe(location2.get('query'));
    });

    test('parse', (): void => {
        const location1: IURL = URL.parse(
            'foo://username:password@www.example.com:123/hello/world/there.html?name=ferret#foo'
        );

        expect(location1.get('protocol')).toBe('foo:');
        expect(location1.get('username')).toBe('username');
        expect(location1.get('password')).toBe('password');
        expect(location1.get('host')).toBe('www.example.com:123');
        expect(location1.get('hostname')).toBe('www.example.com');
        expect(location1.get('port')).toBe(123);
        expect(location1.get('pathname')).toBe('/hello/world/there.html');
        expect(location1.get('search')).toBe('?name=ferret');
        expect(location1.get('query')).toEqual({ name: 'ferret' });
        expect(location1.get('hash')).toBe('#foo');
        expect(location1.get('href')).toBe(
            'foo://username:password@www.example.com:123/hello/world/there.html?name=ferret#foo'
        );
        expect(location1.get('origin')).toBe('foo://www.example.com:123');

        const location2: IURL = URL.parse('http://example.com/whatever/?qs=32');

        expect(location2.get('protocol')).toBe('http:');
        expect(location2.get('username')).toBe('');
        expect(location2.get('password')).toBe('');
        expect(location2.get('host')).toBe('example.com');
        expect(location2.get('hostname')).toBe('example.com');
        expect(location2.get('port')).toBeNull();
        expect(location2.get('pathname')).toBe('/whatever/');
        expect(location2.get('search')).toBe('?qs=32');
        expect(location2.get('query')).toEqual({ qs: '32' });
        expect(location2.get('hash')).toBe('');
        expect(location2.get('href')).toBe('http://example.com/whatever/?qs=32');
        expect(location2.get('origin')).toBe('http://example.com');

        const location3: IURL = URL.parse('/foo/bar/?foo=bar');

        expect(location3.get('protocol')).toBe('');
        expect(location3.get('username')).toBe('');
        expect(location3.get('password')).toBe('');
        expect(location3.get('host')).toBe('');
        expect(location3.get('hostname')).toBe('');
        expect(location3.get('port')).toBeNull();
        expect(location3.get('pathname')).toBe('/foo/bar/');
        expect(location3.get('search')).toBe('?foo=bar');
        expect(location3.get('query')).toEqual({ foo: 'bar' });
        expect(location3.get('hash')).toBe('');
        expect(location3.get('href')).toBe('/foo/bar/?foo=bar');
        expect(location3.get('origin')).toBe('');

        const location4: IURL = URL.parse('//username:password@www.example.com:123/hello/world/there.html?name=ferret#foo');

        expect(location4.get('protocol')).toBe('');
        expect(location4.get('username')).toBe('username');
        expect(location4.get('password')).toBe('password');
        expect(location4.get('host')).toBe('www.example.com:123');
        expect(location4.get('hostname')).toBe('www.example.com');
        expect(location4.get('port')).toBe(123);
        expect(location4.get('pathname')).toBe('/hello/world/there.html');
        expect(location4.get('search')).toBe('?name=ferret');
        expect(location4.get('query')).toEqual({ name: 'ferret' });
        expect(location4.get('hash')).toBe('#foo');
        expect(location4.get('href')).toBe(
            '//username:password@www.example.com:123/hello/world/there.html?name=ferret#foo'
        );
        expect(location4.get('origin')).toBe('//www.example.com:123');

        const location5: IURL = URL.parse('mailto:test@example.com');

        expect(location5.get('protocol')).toBe('mailto:');
        expect(location5.get('username')).toBe('');
        expect(location5.get('password')).toBe('');
        expect(location5.get('host')).toBe('');
        expect(location5.get('hostname')).toBe('');
        expect(location5.get('port')).toBeNull();
        expect(location5.get('pathname')).toBe('test@example.com');
        expect(location5.get('search')).toBe('');
        expect(location5.get('query')).toEqual({});
        expect(location5.get('hash')).toBe('');
        expect(location5.get('href')).toBe('mailto:test@example.com');
        expect(location5.get('origin')).toBe('');

        const location6: IURL = URL.parse('http://username@example.com');

        expect(location6.get('protocol')).toBe('http:');
        expect(location6.get('username')).toBe('username');
        expect(location6.get('password')).toBe('');
        expect(location6.get('host')).toBe('example.com');
        expect(location6.get('hostname')).toBe('example.com');
        expect(location6.get('port')).toBeNull();
        expect(location6.get('pathname')).toBe('/');
        expect(location6.get('search')).toBe('');
        expect(location6.get('query')).toEqual({});
        expect(location6.get('hash')).toBe('');
        expect(location6.get('href')).toBe('http://username@example.com/');
        expect(location6.get('origin')).toBe('http://example.com');

        const location7: IURL = URL.parse('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');

        expect(location7.get('protocol')).toBe('data:');
        expect(location7.get('username')).toBe('');
        expect(location7.get('password')).toBe('');
        expect(location7.get('host')).toBe('');
        expect(location7.get('hostname')).toBe('');
        expect(location7.get('port')).toBeNull();
        expect(location7.get('pathname')).toBe('text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
        expect(location7.get('search')).toBe('');
        expect(location7.get('query')).toEqual({});
        expect(location7.get('hash')).toBe('');
        expect(location7.get('href')).toBe('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
        expect(location7.get('origin')).toBe('');

        const location8: IURL = URL.parse('file:///foo/bar');

        expect(location8.get('protocol')).toBe('file:');
        expect(location8.get('username')).toBe('');
        expect(location8.get('password')).toBe('');
        expect(location8.get('host')).toBe('');
        expect(location8.get('hostname')).toBe('');
        expect(location8.get('port')).toBeNull();
        expect(location8.get('pathname')).toBe('/foo/bar');
        expect(location8.get('search')).toBe('');
        expect(location8.get('query')).toEqual({});
        expect(location8.get('hash')).toBe('');
        expect(location8.get('href')).toBe('file:///foo/bar');
        expect(location8.get('origin')).toBe('');

        const location9: IURL = URL.parse('file:///');

        expect(location9.get('protocol')).toBe('file:');
        expect(location9.get('username')).toBe('');
        expect(location9.get('password')).toBe('');
        expect(location9.get('host')).toBe('');
        expect(location9.get('hostname')).toBe('');
        expect(location9.get('port')).toBeNull();
        expect(location9.get('pathname')).toBe('/');
        expect(location9.get('search')).toBe('');
        expect(location9.get('query')).toEqual({});
        expect(location9.get('hash')).toBe('');
        expect(location9.get('href')).toBe('file:///');
        expect(location9.get('origin')).toBe('');

        const location10: IURL = new URL();

        expect(location10.get('protocol')).toBe('');
        expect(location10.get('username')).toBe('');
        expect(location10.get('password')).toBe('');
        expect(location10.get('host')).toBe('');
        expect(location10.get('hostname')).toBe('');
        expect(location10.get('port')).toBeNull();
        expect(location10.get('pathname')).toBe('');
        expect(location10.get('search')).toBe('');
        expect(location10.get('query')).toEqual({});
        expect(location10.get('hash')).toBe('');
        expect(location10.get('href')).toBe('');
        expect(location10.get('origin')).toBe('');
    });

    test('slash in pathname', (): void => {
        expect(URL.parse('http://example.com').get('pathname')).toBe('/');
        expect(URL.parse('http://example.com/').get('pathname')).toBe('/');
    });

    test('no default protocol', (): void => {
        expect(URL.parse('http://example.com:80/').toString()).toBe('http://example.com/');
        expect(URL.parse('ws://example.com:80/').toString()).toBe('ws://example.com/');
        expect(URL.parse('https://example.com:443/').toString()).toBe('https://example.com/');
        expect(URL.parse('wss://example.com:443/').toString()).toBe('wss://example.com/');
        expect(URL.parse('ftp://example.com:21/').toString()).toBe('ftp://example.com/');
    });

    test('correct host after removing default protocol', (): void => {
        expect(URL.parse('http://example.com:80').get('host')).toBe('example.com');
        expect(URL.parse('ws://example.com:80').get('host')).toBe('example.com');
        expect(URL.parse('https://example.com:443').get('host')).toBe('example.com');
        expect(URL.parse('wss://example.com:443').get('host')).toBe('example.com');
        expect(URL.parse('ftp://example.com:21').get('host')).toBe('example.com');
    });

    test('add slash for query and hash', (): void => {
        const location1: IURL = URL.parse('http://example.com').set({
            pathname: '',
            hash: 'foo'
        });

        expect(location1.toString()).toBe('http://example.com/#foo');

        const location2: IURL = URL.parse('http://example.com').set({
            pathname: '',
            query: {
                foo: 'bar'
            }
        });

        expect(location2.toString()).toBe('http://example.com/?foo=bar');
    });

    test('add colon mark', (): void => {
        const location: IURL = URL.parse('http://example.com').set({
            protocol: 'https'
        });

        expect(location.toString()).toBe('https://example.com/');
    });

    test('add question mark', (): void => {
        const location: IURL = URL.parse('http://example.com').set({
            search: 'foo=bar'
        });

        expect(location.toString()).toBe('http://example.com/?foo=bar');
    });

    test('add hash mark', (): void => {
        const location: IURL = URL.parse('http://example.com').set({
            hash: 'foo'
        });

        expect(location.toString()).toBe('http://example.com/#foo');
    });

    test('set host', (): void => {
        const location1: IURL = URL.parse('http://example.com').set({
            host: 'foo.bar:2100'
        });

        expect(location1.toString()).toBe('http://foo.bar:2100/');

        const location2: IURL = URL.parse('http://example.com').set({
            host: 'foo.bar'
        });

        expect(location2.toString()).toBe('http://foo.bar/');
    });
});
