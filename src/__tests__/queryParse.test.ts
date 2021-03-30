import queryParse from '../queryParse';

describe('queryParse', (): void => {
    test('allows empty values', (): void => {
        expect(queryParse('')).toEqual({});
    });

    test('parses a query string', (): void => {
        expect(queryParse('foo=bar')).toEqual({ foo: 'bar' });
        expect(queryParse('foo=')).toEqual({ foo: '' });
    });

    test('parses multiple query string', (): void => {
        expect(queryParse('foo=bar&key=val')).toEqual({ foo: 'bar', key: 'val' });
        expect(queryParse('foo=bar&key=')).toEqual({ foo: 'bar', key: '' });
    });

    test('parses nested parameters', (): void => {
        expect(queryParse('foo[bar]=baz')).toEqual({ foo: { bar: 'baz' } });
        expect(queryParse('foo[bar][baz]=foobarbaz')).toEqual({ foo: { bar: { baz: 'foobarbaz' } } });
    });

    test('parses query string without a value', (): void => {
        expect(queryParse('foo')).toEqual({ foo: null });
        expect(queryParse('foo', { strictNullHandling: false })).toEqual({ foo: '' });
        expect(queryParse('foo&bar')).toEqual({ foo: null, bar: null });
        expect(queryParse('foo&bar', { strictNullHandling: false })).toEqual({ foo: '', bar: '' });
        expect(queryParse('foo=bar&baz')).toEqual({ foo: 'bar', baz: null });
        expect(queryParse('foo=bar&baz', { strictNullHandling: false })).toEqual({ foo: 'bar', baz: '' });
    });

    test('parses an explicit array', (): void => {
        expect(queryParse('a[]=b')).toEqual({ a: ['b'] });
        expect(queryParse('a[]=b&a[]=c')).toEqual({ a: ['b', 'c'] });
        expect(queryParse('a[]=b&a[]=c&a[]=d')).toEqual({ a: ['b', 'c', 'd'] });

        expect(queryParse('a=b&a=c&a=d')).toEqual({ a: ['b', 'c', 'd'] });
        expect(queryParse('a[0]=b&a[1]=c&a[2]=d')).toEqual({ a: ['b', 'c', 'd'] });
    });

    test('parses a mix of simple and explicit arrays', (): void => {
        expect(queryParse('a=b&a[]=c')).toEqual({ a: ['b', 'c'] });
        expect(queryParse('a[]=b&a=c')).toEqual({ a: ['b', 'c'] });
        expect(queryParse('a[0]=b&a=c')).toEqual({ a: ['b', 'c'] });
        expect(queryParse('a=b&a[0]=c')).toEqual({ a: ['b', 'c'] });
        expect(queryParse('a[1]=b&a=c')).toEqual({ a: ['b', 'c'] });
        expect(queryParse('a=b&a[1]=c')).toEqual({ a: ['b', 'c'] });
        expect(queryParse('a=b&a[]=c')).toEqual({ a: ['b', 'c'] });
    });

    test('parses a nested array', (): void => {
        expect(queryParse('a[b][]=c&a[b][]=d')).toEqual({ a: { b: ['c', 'd'] } });
        expect(queryParse('a[b][0][foo]=c&a[b][1][foo]=d')).toEqual({ a: { b: [{ foo: 'c' }, { foo: 'd' }] } });
    });

    test('transforms arrays to objects', (): void => {
        expect(queryParse('foo[0]=bar&foo[bad]=baz')).toEqual({ foo: { 0: 'bar', bad: 'baz' } });
        expect(queryParse('foo[bad]=baz&foo[0]=bar')).toEqual({ foo: { bad: 'baz', 0: 'bar' } });
        expect(queryParse('foo[bad]=baz&foo[]=bar')).toEqual({ foo: { bad: 'baz', 0: 'bar' } });
        expect(queryParse('foo[]=bar&foo[bad]=baz')).toEqual({ foo: { 0: 'bar', bad: 'baz' } });
        expect(queryParse('foo[bad]=baz&foo[]=bar&foo[]=foo')).toEqual({ foo: { bad: 'baz', 0: 'bar', 1: 'foo' } });
        expect(queryParse('foo[0][a]=a&foo[0][b]=b&foo[1][a]=aa&foo[1][b]=bb')).toEqual({
            foo: [
                { a: 'a', b: 'b' },
                { a: 'aa', b: 'bb' }
            ]
        });
    });

    test('correctly prunes undefined values when converting an array to an object', (): void => {
        expect(queryParse('a[2]=b&a[99999999]=c')).toEqual({ a: { 2: 'b', 99999999: 'c' } });
    });

    test('parses arrays of objects', (): void => {
        expect(queryParse('a[][b]=c')).toEqual({ a: [{ b: 'c' }] });
        expect(queryParse('a[0][b]=c')).toEqual({ a: [{ b: 'c' }] });
    });

    test('URI decode', (): void => {
        expect(queryParse('foo=bar%20baz')).toEqual({ foo: 'bar baz' });
        expect(queryParse('foo=bar%21%27%28%29%2Abaz')).toEqual({ foo: 'bar!\'()*baz' });
    });
});
