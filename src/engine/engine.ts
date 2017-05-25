/**
 * Main engine
 */
import { IDisplay } from "../interfaces/IDisplay";
import { IEngine } from "../interfaces/IEngine";
import { ILogger } from "../interfaces/ILogger";

export class Engine implements IEngine {
    private _logger: ILogger;
    private _display: IDisplay;

    constructor(logger: ILogger, display: IDisplay) {
        this._logger = logger;
        this._display = display;
    }

    public init(args: { [id: string]: string | null }): number {
        this._display.info("Inside engine:init");
        return 0;
    }
}