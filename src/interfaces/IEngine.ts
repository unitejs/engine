import { UniteLanguage } from "../configuration/models/unite/uniteLanguage";
import { IKeyValue } from "./IKeyValueT";
/**
 * Interface for main engine.
 */
export interface IEngine {
    init(name: string, language: UniteLanguage): number;

    getAvailableLanguages(): IKeyValue<UniteLanguage>[];
}