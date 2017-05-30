import { ExceptionBase } from "../interfaces/ExceptionBase";
import { JsonHelper } from "./jsonHelper";
import { StringHelper } from "./stringHelper";
/**
 * Handle errors as gracefully as possible
 */
export class ErrorHandler {
    public static format(err: any): string {
        if (err === null || err === undefined) {
            return "unknown error";
        } else if (err instanceof ExceptionBase) {
            return (err as ExceptionBase).toString();
        } else if (err instanceof Error) {
            return (err as Error).message;
        } else {
            if (StringHelper.isString(err)) {
                return err;
            } else {
                return JsonHelper.stringify(err, "\t");
            }
        }
    }
}