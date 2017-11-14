declare module "gulp-postcss" {
    import * as stream from "stream";

    function postcss(): stream.Transform;

    namespace postcss { }

    export = postcss;
}