/**
 * Template helper
 */
import { EngineVariables } from "../engine/engineVariables";

export class TemplateHelper {
    public static generateSubstitutions(name: string): { [id: string]: string } {
        const substitutions: { [id: string]: string } = {};

        const words: string[] = TemplateHelper.generateWords(name);

        if (words.length > 0) {
            substitutions[`gen-name-snake`] = TemplateHelper.createSnake(words);
            substitutions[`genNameCamel`] = TemplateHelper.createCamel(words);
            substitutions[`GenNamePascal`] = TemplateHelper.createPascal(words);
            substitutions[`Gen Name Human`] = TemplateHelper.createHuman(words);
        }

        return substitutions;
    }

    public static generateWords(name: string): string[] {
        const words: string[] = [];

        if (name !== undefined && name !== null) {
            const justAlphaNum = name.replace(/[^a-zA-Z0-9 ]/g, " ").trim();

            if (justAlphaNum.length > 0) {
                for (let i = 0; i < justAlphaNum.length; i++) {
                    // Is this lower or number
                    if (/[a-z0-9]/.test(justAlphaNum[i])) {
                        if (words.length === 0) {
                            // No words so push new word upper case of character
                            words.push(justAlphaNum[i].toUpperCase());
                        } else {
                            // Does the current word have any length
                            if (words[words.length - 1].length === 0) {
                                // Zero length so append upper case
                                words[words.length - 1] += justAlphaNum[i].toUpperCase();
                            } else {
                                // Already in word so just append
                                words[words.length - 1] += justAlphaNum[i];
                            }
                        }
                    } else {
                        // Is this upper
                        if (/[A-Z]/.test(justAlphaNum[i])) {
                            // Are we already in a word?
                            if (words.length > 0 && words[words.length - 1].length > 0) {
                                // Yes, if it is already all caps just append
                                if (/^[^a-z]*$/.test(words[words.length - 1])) {
                                    // Current word all caps
                                    words[words.length - 1] += justAlphaNum[i];
                                } else {
                                    // Current word is not all caps so start a new one
                                    words.push(justAlphaNum[i]);
                                }
                            } else {
                                if (words.length > 0) {
                                    // Current word is empty so just append
                                    words[words.length - 1] += justAlphaNum[i];
                                } else {
                                    // No words so start a new one
                                    words.push(justAlphaNum[i]);
                                }
                            }
                        } else {
                            // Must be a space
                            if (words.length > 0 && words[words.length - 1].length > 0) {
                                // Already in a word so start a new one as long as it is not empty
                                words.push("");
                            }
                        }
                    }
                }
            }
        }

        return words;
    }

    public static createSnake(words: string[]): string {
        return words.join("-").toLowerCase();
    }

    public static createPascal(words: string[]): string {
        return words.join("");
    }

    public static createHuman(words: string[]): string {
        return words.join(" ");
    }

    public static createCamel(words: string[]): string {
        return words[0][0].toLowerCase() + words[0].substring(1) + words.slice(1).join("");
    }

    public static replaceSubstitutions(substitutions: { [id: string]: string | string[] }, input: string): string {
        let output = input;

        if (input !== null && input !== undefined && substitutions !== undefined && substitutions !== null) {
            Object.keys(substitutions).forEach(key => {
                let rep: string[];
                if (Array.isArray(substitutions[key])) {
                    rep = <string[]>substitutions[key];
                } else {
                    rep = [<string>substitutions[key]];
                }
                output = output.replace(new RegExp(`${key}`, "gm"), rep.join("\r\n"));
            });
        }

        return output;
    }

    public static createCodeSubstitutions(engineVariables: EngineVariables): { [id: string]: string[] } {
        return {
            "/\\* Synthetic Import \\*/ ": [engineVariables.syntheticImport],
            "\"genModuleId\"": [engineVariables.moduleId]
        };
    }
}
