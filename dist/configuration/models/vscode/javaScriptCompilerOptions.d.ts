/**
 * Model of VSCode jsconfig.json file.
 */
import { JavaScriptTarget } from "./javaScriptTarget";
export declare class JavaScriptCompilerOptions {
    noLib: boolean;
    target: JavaScriptTarget;
    experimentalDecorators: boolean;
    allowSyntheticDefaultImports: boolean;
    baseUrl: string;
    paths: {
        [id: string]: string[];
    };
}
