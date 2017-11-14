declare module 'uglifyjs-webpack-plugin' {
    import * as webpack from "webpack";

    class UglifyJSPlugin {
        constructor();
        apply(compiler: webpack.Compiler): void;
    }

    module UglifyJSPlugin { }
    export = UglifyJSPlugin;
}