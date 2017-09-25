/**
 * Model of VSCode jsconfig.json file.
 */
import { JavaScriptTarget } from "./javaScriptTarget";

export class JavaScriptCompilerOptions {
    public noLib: boolean;
    public target: JavaScriptTarget;
    public experimentalDecorators: boolean;
    public allowSyntheticDefaultImports: boolean;
    public baseUrl: string;
    public paths: { [id: string] : string[] };
}
