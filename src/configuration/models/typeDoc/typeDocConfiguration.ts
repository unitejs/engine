/**
 * Model of TypeDoc Configuration (typedoc.json) file.
 */
export class TypeDocConfiguration {
    public mode: string;
    public module: string;
    public theme: string;
    public out: string;
    public target: string;
    public moduleResolution: string;
    public includeDeclarations: boolean;
    public ignoreCompilerErrors: boolean;
    public experimentalDecorators: boolean;
    public externalPattern: string;
    public excludeExternals: boolean;
    public emitDecoratorMetadata: boolean;
    public preserveConstEnums: boolean;
    public stripInternal: boolean;
    public suppressExcessPropertyErrors: boolean;
    public suppressImplicitAnyIndexErrors: boolean;
}
