/**
 * Main engine
 */
import { UniteLanguage } from "../configuration/models/unite/uniteLanguage";
import { IDisplay } from "../interfaces/IDisplay";
import { IEngine } from "../interfaces/IEngine";
import { IKeyValue } from "../interfaces/IKeyValueT";
import { ILogger } from "../interfaces/ILogger";
export declare class Engine implements IEngine {
    private _logger;
    private _display;
    constructor(logger: ILogger, display: IDisplay);
    init(name: string, language: UniteLanguage): number;
    getAvailableLanguages(): IKeyValue<UniteLanguage>[];
}
