declare module "gulp-lesshint" {
    interface Options {
    }

    function gulpLessHint(options?: Options): NodeJS.ReadWriteStream;

    namespace gulpLessHint { 
        function reporter(name?: string): NodeJS.ReadWriteStream;
        function failOnError(): NodeJS.ReadWriteStream;
    }

    export = gulpLessHint;
}