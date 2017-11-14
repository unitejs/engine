declare module "gulp-cssnano" {
    import * as stream from "stream";

    function cssnano(): stream.Transform;

    namespace cssnano { }

    export = cssnano;
}