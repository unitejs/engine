/**
 * Model of Babel Configuration (.babelrc) file.
 * From here https://babeljs.io/docs/usage/api/
 */
export class BabelConfiguration {
    public ast: boolean;
    public auxiliaryCommentAfter: string;
    public auxiliaryCommentBefore: string;
    public code: boolean;
    public comments: boolean;
    public compact: string;
    public env: { [id: string]: {}};
    public extends: string;
    public filename: string;
    public filenameRelative: string;
    public generatorOpts: {};
    public highlightCode: boolean;
    public ignore: string;
    public inputSourceMap: string;
    public minified: boolean;
    public moduleId: string;
    public moduleIds: boolean;
    public moduleRoot: string;
    public only: string;
    public parserOpts: {};
    public plugins: string[];
    public presets: {}[];
    public retainLines: boolean;
    public resolveModuleSource: string;
    public sourceFileName: string;
    public sourceMaps: boolean;
    public sourceMapTarget: string;
    public sourceRoot: string;
    public sourceType: string;
}