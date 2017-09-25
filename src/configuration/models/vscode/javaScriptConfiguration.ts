/**
 * Model of VSCode jsconfig.json file.
 * see https://code.visualstudio.com/docs/languages/jsconfig
 */
import { JavaScriptCompilerOptions } from "./javaScriptCompilerOptions";

export class JavaScriptConfiguration {
    public compilerOptions: JavaScriptCompilerOptions;
    public include: string[];
    public exclude: string[];
}
