/**
 * Gulp tasks for building JavaScript.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const babel = require('gulp-babel');

gulp.task('build-transpile', () => {
    display.info('Running', "Babel");

    const buildConfig = bc.getBuildConfig();

    let sourceMapPlaceholderInit;
    let sourceMapPlaceholderWrite;

    if (buildConfig.sourceMaps) {
        const sourceMaps = require('gulp-sourcemaps');
        sourceMapPlaceholderInit = sourceMaps.init();
        sourceMapPlaceholderWrite = sourceMaps.write({includeContent: true});
    } else {
        sourceMapPlaceholderInit = gulpUtil.noop();
        sourceMapPlaceholderWrite = gulpUtil.noop();
    }

    return gulp.src(buildConfig.srcFolder + '**/*.js')
        .pipe(sourceMapPlaceholderInit)
        .pipe(babel())
        .pipe(sourceMapPlaceholderWrite)
        .pipe(gulp.dest(buildConfig.distFolder));
});

