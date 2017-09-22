/**
 * Template helper
 */
export declare class TemplateHelper {
    static generateSubstitutions(prefix: string, name: string): {
        [id: string]: string;
    };
    static replaceSubstitutions(substitutions: {
        [id: string]: string;
    }, input: string): string;
}
