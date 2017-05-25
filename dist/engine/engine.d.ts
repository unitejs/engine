/**
 * Main engine
 */
import { IDisplay } from "../interfaces/IDisplay";
import { IEngine } from "../interfaces/IEngine";
import { ILogger } from "../interfaces/ILogger";
export declare class Engine implements IEngine {
    private _logger;
    private _display;
    constructor(logger: ILogger, display: IDisplay);
    init(args: {
        [id: string]: string | null;
    }): number;
}
