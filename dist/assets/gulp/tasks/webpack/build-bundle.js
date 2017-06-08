/**
 * Gulp tasks for wrapping Webpack modules.
 */
const display = require('./util/display');
const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack-stream');
const uc = require('./util/unite-config');

gulp.task('build-bundle', function () {
    display.info('Running', "webpack");

    const uniteConfig = uc.getUniteConfig();

    return gulp.src(path.join(uniteConfig.directories.dist, "entryPoint.js"))
        .pipe(webpack({
            devtool: 'inline-source-map',
            output: {
                filename: 'app-bundle.js'
            },
            module: {
                preLoaders: [
                    {
                        test: /\.js$/,
                        loader: "source-map-loader"
                    }
                ]
            }
        }))
        .pipe(gulp.dest(uniteConfig.directories.dist));
});