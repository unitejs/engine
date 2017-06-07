/**
 * Gulp tasks for wrapping Webpack modules.
 */
const display = require('./util/display');
const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack-stream');
const bc = require('./util/build-config');

gulp.task('unit-bundle', function () {
    display.info('Running', "webpack");

    const buildConfig = bc.getBuildConfig();

    return gulp.src(path.join(buildConfig.unitTestFolder, "unitBootstrap.js"))
        .pipe(webpack({
            devtool: 'inline-source-map',
            output: {
                filename: 'test-bundle.js'
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
        .pipe(gulp.dest(buildConfig.unitTestDistFolder));
});