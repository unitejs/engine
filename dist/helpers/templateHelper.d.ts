/**
 * Template helper
 */
import { EngineVariables } from "../engine/engineVariables";
export declare class TemplateHelper {
    static generateSubstitutions(name: string): {
        [id: string]: string;
    };
    static replaceSubstitutions(substitutions: {
        [id: string]: string;
    }, input: string): string;
    static createCodeSubstitutions(engineVariables: EngineVariables): {
        [id: string]: string[];
    };
}
