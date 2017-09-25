/**
 * Model of TypeScript Configuration (tsconfig.json) file.
 * The properties defined here are sourced from https://github.com/Microsoft/TypeScript/blob/master/src/compiler/commandLineParser.ts
 */
import { TypeScriptCompilerOptions } from "./typeScriptCompilerOptions";

export class TypeScriptConfiguration {
    public compilerOptions: TypeScriptCompilerOptions;
    public include: string[];
    public exclude: string[];
}
