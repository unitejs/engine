export declare abstract class ExceptionBase {
    context: string;
    reference: string;
    message: string;
    parameters: any[];
    data: any;
    stackTrace: string[];
    innerException: ExceptionBase;
    constructor(context: any, reference: string, message: string, parameters: any[], data: any);
    private static exceptionToStringInternal(baseException);
    private static substituteParameters(message, parameters);
    toString(): string;
}
