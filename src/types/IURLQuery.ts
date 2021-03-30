type URLQueryPrimitiveValueType = string | number | boolean | null | undefined;

export default interface IURLQuery {
    [key: string]: URLQueryPrimitiveValueType | Array<URLQueryPrimitiveValueType> | IURLQuery | Array<IURLQuery>;
}
