declare module "gulp-stylelint" {
    import { LinterOptions } from "stylelint";

    interface Options extends LinterOptions {
        failAfterError?: boolean;
        reportOutputDir?: string;
        reporters?: { formatter: "string" | "verbose" | "json"; save?: boolean; console?: boolean }[];
        debug?: string;
    }

    function gulpStyleLint(options?: Options): NodeJS.ReadWriteStream;

    namespace gulpStyleLint { }

    export = gulpStyleLint;
}