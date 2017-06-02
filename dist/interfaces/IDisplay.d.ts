/**
 * Interface for displaying output.
 */
export interface IDisplay {
    banner(message: string): void;
    log(message: string): void;
    info(message: string): void;
    error(message: string): void;
    diagnostics(message: string): void;
}
