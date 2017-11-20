/**
 * Model of Babel Configuration (.babelrc) file.
 * From here https://babeljs.io/docs/usage/api/
 */
export declare class BabelConfiguration {
    ast: boolean;
    auxiliaryCommentAfter: string;
    auxiliaryCommentBefore: string;
    babelrc: boolean;
    code: boolean;
    comments: boolean;
    compact: string;
    env: {
        [id: string]: {};
    };
    extends: string;
    filename: string;
    filenameRelative: string;
    generatorOpts: {};
    highlightCode: boolean;
    ignore: string;
    inputSourceMap: string;
    minified: boolean;
    moduleId: string;
    moduleIds: boolean;
    moduleRoot: string;
    only: string;
    parserOpts: {};
    plugins: (string | any[])[];
    presets: any[];
    retainLines: boolean;
    resolveModuleSource: string;
    sourceFileName: string;
    sourceMaps: boolean;
    sourceMapTarget: string;
    sourceRoot: string;
    sourceType: string;
}
