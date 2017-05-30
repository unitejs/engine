/**
 * Base class for exceptions.
 */
import { ObjectHelper } from "../core/objectHelper";

export abstract class ExceptionBase {
    public context: string;
    public reference: string;
    public message: string;
    public parameters: any[];
    public data: any;
    public stackTrace: string[];

    public innerException: ExceptionBase;

    constructor(context: any, reference: string, message: string, parameters: any[], data: any) {
        this.context = ObjectHelper.getClassName(context);
        this.reference = reference;
        this.message = message;
        this.parameters = parameters;

        if (data instanceof ExceptionBase) {
            this.innerException = data;
        } else {
            this.data = data;
        }

        let stack: string | undefined = "";
        if (this.data && this.data.stack) {
            stack = this.data.stack;
        } else {
            stack = new Error("").stack;
        }

        if (stack) {
            this.stackTrace = stack.split("\n");

            if (stack.length > 3) {
                this.stackTrace = this.stackTrace.slice(3);
            }
        }
    }

    private static exceptionToStringInternal(baseException: ExceptionBase): string {
        const parts: string[] = [];

        if (baseException.context && baseException.reference) {
            parts.push(ObjectHelper.getClassName(baseException.context) + "::" + baseException.reference);
        }
        if (baseException.message) {
            parts.push(ExceptionBase.substituteParameters(baseException.message, baseException.parameters));
        }

        if (baseException.data) {
            if (baseException.data.message) {
                parts.push(baseException.data.message);
            } else {
                parts.push(JSON.stringify(baseException.data));
            }
        }

        if (baseException.stackTrace) {
            baseException.stackTrace.forEach(st => {
                parts.push(st);
            });
        }

        if (baseException.innerException) {
            parts.push("-----------------------------------------------------------------");
            parts.push(this.exceptionToStringInternal(baseException.innerException));
        }

        return parts.join("\r\n\r\n");
    }

    private static substituteParameters(message: string, parameters: any[]): string {
        return message && parameters ? message.replace(/{(\d+)}/g, (match, idx) => {
            return parameters[idx];
        }) : message;
    }

    public toString(): string {
        return ExceptionBase.exceptionToStringInternal(this);
    }
}
