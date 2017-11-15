declare module "gulp-sass-lint" {
    interface Options {
    }

    function gulpSassLint(options?: Options): NodeJS.ReadWriteStream;

    namespace gulpSassLint { 
        function format(): NodeJS.ReadWriteStream;
        function failOnError(): NodeJS.ReadWriteStream;
    }

    export = gulpSassLint;
}