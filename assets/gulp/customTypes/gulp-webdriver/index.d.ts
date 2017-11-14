declare module "gulp-webdriver" {
    import * as stream from "stream";

    function webdriver(): stream.Transform;

    namespace webdriver { }

    export = webdriver;
}