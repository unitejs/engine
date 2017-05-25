/**
 * Main engine
 */
import { UniteLanguage } from "../configuration/models/unite/uniteLanguage";
import { EnumEx } from "../core/enumEx";
import { IDisplay } from "../interfaces/IDisplay";
import { IEngine } from "../interfaces/IEngine";
import { IKeyValue } from "../interfaces/IKeyValueT";
import { ILogger } from "../interfaces/ILogger";

export class Engine implements IEngine {
    private _logger: ILogger;
    private _display: IDisplay;

    constructor(logger: ILogger, display: IDisplay) {
        this._logger = logger;
        this._display = display;
    }

    public init(name: string, language: UniteLanguage): number {
        this._display.info("Inside engine:init");
        return 0;
    }

    public getAvailableLanguages(): IKeyValue<UniteLanguage>[] {
        return EnumEx.getNamesAndValues(UniteLanguage);
    }
}