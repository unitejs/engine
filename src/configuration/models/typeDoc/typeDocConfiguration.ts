/**
 * Model of TypeDoc Configuration (typedoc.json) file.
 */
export class TypeDocConfiguration {
    public mode: string;
    public theme: string;
    public out: string;
    public ignoreCompilerErrors: boolean;
    public externalPattern: string;
    public excludeExternals: boolean;
    public includeDeclarations: boolean;
    public preserveConstEnums: boolean;
    public stripInternal: boolean;
    public suppressExcessPropertyErrors: boolean;
    public suppressImplicitAnyIndexErrors: boolean;

    public module: string;
    public target: string;
    public moduleResolution: string;
    public experimentalDecorators: boolean;
    public emitDecoratorMetadata: boolean;
    public jsx: string;
}
