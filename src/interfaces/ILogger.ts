/**
 * Interface for logging diagnostics.
 */
export interface ILogger {
    // tslint:disable:no-any
    log(message: string, args?: { [id: string]: any }): void;
    info(message: string, args?: { [id: string]: any }): void;
    error(message: string, args?: { [id: string]: any }): void;
    // tslint:enable:no-any
}