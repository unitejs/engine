declare module "gulp-stylus" {
    import * as stream from "stream";

    function stylus(): stream.Transform;

    namespace stylus { }

    export = stylus;
}