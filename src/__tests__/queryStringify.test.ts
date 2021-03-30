import queryStringify from '../queryStringify';

describe('queryStringify', (): void => {
    test('should encode simple objects', (): void => {
        expect(queryStringify({})).toBe('');
        expect(queryStringify({ a: 'b' })).toBe('a=b');
        expect(queryStringify({ a: 'b', c: 'd' })).toBe('a=b&c=d');
    });

    test('nested objects', (): void => {
        expect(queryStringify({ a: { b: 'c' } })).toBe('a[b]=c');

        expect(
            queryStringify({
                a: {
                    b: {
                        c: 'd',
                        e: 'f'
                    },
                    foo: {
                        bar: 'baz'
                    }
                }
            })
        ).toBe('a[b][c]=d&a[b][e]=f&a[foo][bar]=baz');
    });

    test('handle array value', (): void => {
        expect(queryStringify({ a: ['b', 'c', 'd'] }, { arrayFormat: 'repeat' })).toBe('a=b&a=c&a=d');
        expect(queryStringify({ a: [{ b: 'c' }, { b: 'd' }] }, { arrayFormat: 'repeat' })).toBe('a[b]=c&a[b]=d');
        expect(queryStringify({ a: [{ b: ['c', 'd'] }] }, { arrayFormat: 'repeat' })).toBe('a[b]=c&a[b]=d');

        expect(queryStringify({ a: ['b', 'c', 'd'] })).toBe('a=b&a=c&a=d');
        expect(queryStringify({ a: [{ b: 'c' }, { b: 'd' }] })).toBe('a[b]=c&a[b]=d');
        expect(queryStringify({ a: [{ b: ['c', 'd'] }] })).toBe('a[b]=c&a[b]=d');
    });

    test('handle empty array value', (): void => {
        expect(queryStringify({ a: 'b', foo: [] })).toBe('a=b');
    });

    test('handle undefined values in array', (): void => {
        expect(queryStringify({ a: 'b', foo: [undefined] })).toBe('a=b');
    });

    test('handle null values in array', (): void => {
        expect(queryStringify({ a: 'b', foo: [null] }, { arrayFormat: 'repeat' })).toBe('a=b&foo');
        expect(queryStringify({ a: 'b', foo: { bar: [null] } }, { arrayFormat: 'repeat' })).toBe('a=b&foo[bar]');

        expect(queryStringify({ a: 'b', foo: [null] })).toBe('a=b&foo');
        expect(queryStringify({ a: 'b', foo: { bar: [null] } })).toBe('a=b&foo[bar]');

        expect(queryStringify({ a: 'b', foo: [null] }, { strictNullHandling: false })).toBe('a=b&foo=');
        expect(queryStringify({ a: 'b', foo: { bar: [null] } }, { strictNullHandling: false })).toBe('a=b&foo[bar]=');
    });

    test('handle undefined and null values in array', (): void => {
        expect(queryStringify({ a: 'b', foo: [undefined, null, 'bar'] }, { arrayFormat: 'repeat' })).toBe(
            'a=b&foo&foo=bar'
        );
        expect(
            queryStringify(
                {
                    a: 'b',
                    foo: {
                        bar: [undefined, null, 'baz']
                    }
                },
                { arrayFormat: 'repeat' }
            )
        ).toBe('a=b&foo[bar]&foo[bar]=baz');

        expect(queryStringify({ a: 'b', foo: [undefined, null, 'bar'] })).toBe('a=b&foo&foo=bar');
        expect(
            queryStringify({
                a: 'b',
                foo: {
                    bar: [undefined, null, 'baz']
                }
            })
        ).toBe('a=b&foo[bar]&foo[bar]=baz');
    });

    test('array stringify representation with array brackets', (): void => {
        expect(
            queryStringify(
                {
                    foo: ['bar', 'baz', 'baf']
                },
                { arrayFormat: 'brackets' }
            )
        ).toBe('foo[]=bar&foo[]=baz&foo[]=baf');
    });

    test('array stringify representation with array indexes', (): void => {
        expect(
            queryStringify(
                {
                    foo: ['bar', 'baz', 'baf']
                },
                { arrayFormat: 'indices' }
            )
        ).toBe('foo[0]=bar&foo[1]=baz&foo[2]=baf');
    });

    test('array stringify representation with array indexes and sparse array', (): void => {
        expect(
            queryStringify(
                {
                    foo: ['bar', 'baz', 'baf']
                },
                { arrayFormat: 'indices' }
            )
        ).toBe('foo[0]=bar&foo[1]=baz&foo[2]=baf');
    });

    test('URI encode', (): void => {
        expect(queryStringify({ 'foo bar': 'baz faz' })).toBe('foo bar=baz%20faz');
        expect(queryStringify({ 'foo!\'()*bar': 'baz!\'()*faz' })).toBe('foo!\'()*bar=baz%21%27%28%29%2Afaz');
    });

    test('no encoding', (): void => {
        expect(queryStringify({ 'foo:bar': 'baz:faz' }, { encode: false })).toBe('foo:bar=baz:faz');
        expect(queryStringify({ 'foo!\'()*bar': 'baz!\'()*faz' }, { encode: false })).toBe('foo!\'()*bar=baz!\'()*faz');
    });

    test('should not encode undefined values', (): void => {
        expect(queryStringify({ a: 'b', c: undefined })).toBe('a=b');
    });

    test('should encode null values as just a key', (): void => {
        expect(queryStringify({ a: 'b', c: null })).toBe('a=b&c');
        expect(queryStringify({ a: 'b', c: null }, { strictNullHandling: false })).toBe('a=b&c=');
    });
});
