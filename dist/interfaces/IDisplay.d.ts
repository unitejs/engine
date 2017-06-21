/**
 * Interface for displaying output.
 */
export interface IDisplay {
    banner(message: string): void;
    log(message: string, args?: {
        [id: string]: any;
    }): void;
    info(message: string, args?: {
        [id: string]: any;
    }): void;
    error(message: string, err?: any, args?: {
        [id: string]: any;
    }): void;
    diagnostics(message: string, args?: {
        [id: string]: any;
    }): void;
}
