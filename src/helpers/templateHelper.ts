/**
 * Template helper
 */

export class TemplateHelper {
    public static generateSubstitutions(prefix: string, name: string): { [id: string]: string } {
        const substitutions: { [id: string]: string } = {};

        if (name !== undefined &&
            name !== null &&
            prefix !== undefined &&
            prefix !== null &&
            prefix.trim().length > 0) {

            const justAlphaNum = name.replace(/[^a-zA-Z0-9 ]/g, " ").trim();

            if (justAlphaNum.length > 0) {
                const words: string[] = [];

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

                substitutions[`${prefix}`] = name.replace(/\s\s+/g, " ");
                substitutions[`${prefix}_SNAKE`] = words.join("-").toLowerCase();
                substitutions[`${prefix}_CAMEL`] = words[0][0].toLowerCase() + words[0].substring(1) + words.slice(1).join("");
                substitutions[`${prefix}_PASCAL`] = words.join("");
                substitutions[`${prefix}_HUMAN`] = words.join(" ");
            }
        }

        return substitutions;
    }

    public static replaceSubstitutions(substitutions: { [id: string]: string }, input: string): string {
        let output = input;

        if (input !== null && input !== undefined && substitutions !== undefined && substitutions !== null) {
            Object.keys(substitutions).forEach(key => {
                output = output.replace(new RegExp(`{${key}}`, "g"), substitutions[key]);
            });
        }

        return output;
    }
}
