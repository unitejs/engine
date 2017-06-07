/**
 * Gulp tasks for wrapping Webpack modules.
 */
const display = require('./util/display');
const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack-stream');
const bc = require('./util/build-config');

gulp.task('build-bundle', function () {
    display.info('Running', "webpack");

    const buildConfig = bc.getBuildConfig();

    return gulp.src(path.join(buildConfig.distFolder, "entryPoint.js"))
        .pipe(webpack({
            devtool: buildConfig.sourceMaps ? 'inline-source-map' : false,
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
        .pipe(gulp.dest(buildConfig.distFolder));
});