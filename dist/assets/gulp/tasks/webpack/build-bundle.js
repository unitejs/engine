/**
 * Gulp tasks for wrapping Webpack modules.
 */
const display = require('./util/display');
const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack-stream');
const bc = require('./util/build-config');

gulp.task('build-bundle', function() {
    display.info('Running', "webpack");

    const buildConfig = bc.getBuildConfig();

    return gulp.src(path.join(buildConfig.distFolder, "main.js"))
        .pipe(webpack({ 
            output: {
                 filename: 'main.bundle.js'
             }
        }))
        .pipe(gulp.dest(buildConfig.distFolder));
});