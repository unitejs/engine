declare module "gulp-eslint" {
    import * as stream from "stream";

    function eslint(): stream.Transform;

    namespace eslint { 
        function format(): stream.Transform;
        function results(result: ((args: {errorCount: number}) => void)): stream.Transform;
    }

    export = eslint;
}