/**
 * Model of VSCode jsconfig.json file.
 * see https://code.visualstudio.com/docs/languages/jsconfig
 */
import { JavaScriptCompilerOptions } from "./javaScriptCompilerOptions";
export declare class JavaScriptConfiguration {
    compilerOptions: JavaScriptCompilerOptions;
    include: string[];
    exclude: string[];
}
