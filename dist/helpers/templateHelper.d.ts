/**
 * Template helper
 */
import { EngineVariables } from "../engine/engineVariables";
export declare class TemplateHelper {
    static generateSubstitutions(name: string): {
        [id: string]: string;
    };
    static generateWords(name: string): string[];
    static createSnake(words: string[]): string;
    static createPascal(words: string[]): string;
    static createHuman(words: string[]): string;
    static createCamel(words: string[]): string;
    static replaceSubstitutions(substitutions: {
        [id: string]: string | string[];
    }, input: string): string;
    static createCodeSubstitutions(engineVariables: EngineVariables): {
        [id: string]: string[];
    };
}
