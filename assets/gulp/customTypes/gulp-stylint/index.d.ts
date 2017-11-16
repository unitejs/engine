declare module "gulp-stylint" {
    interface Options {
        config?: string;
        reporter?: string | { reporter: string; reporterOptions: { [id:string]: any } };
        rules?: { [id:string]: any };
    }

    function gulpStylint(options?: Options): NodeJS.ReadWriteStream;

    namespace gulpStylint { 
        function reporter(name?: string): NodeJS.ReadWriteStream;
    }

    export = gulpStylint;
}