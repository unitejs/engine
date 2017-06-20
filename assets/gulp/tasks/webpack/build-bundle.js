/**
 * Gulp tasks for wrapping Webpack modules.
 */
const display = require('./util/display');
const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uc = require('./util/unite-config');

gulp.task('build-bundle', function () {
    display.info('Running', "webpack");

    const uniteConfig = uc.getUniteConfig();

    const entry = {};
    const plugins = [];

    const appPackageKeys = Object.keys(uniteConfig.clientPackages).filter(function (key) {
        return uniteConfig.clientPackages[key].includeMode === "app" || uniteConfig.clientPackages[key].includeMode === "both";
    });

    if (appPackageKeys.length > 0) {
        entry.vendor = appPackageKeys;
        plugins.push(new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor-bundle.js' }));
    }
    entry.app = './' + path.join(uniteConfig.directories.dist, "entryPoint.js");

    return gulp.src(entry.app)
        .pipe(webpackStream({
            devtool: 'inline-source-map',
            entry,
            output: {
                filename: 'app-bundle.js',
                devtoolModuleFilenameTemplate: '[resource-path]'
            },
            module: {
                rules: [
                    {
                        enforce: 'pre',
                        test: /\.js$/,
                        loader: "source-map-loader"
                    }
                ]
            },
            plugins
        }, webpack))
        .pipe(gulp.dest(uniteConfig.directories.dist));
});

