/**
 * Interface for logging diagnostics.
 */
export interface ILogger {
    log(message: string, args?: {
        [id: string]: any;
    }): void;
    info(message: string, args?: {
        [id: string]: any;
    }): void;
    error(message: string, exception: any, args?: {
        [id: string]: any;
    }): void;
}
