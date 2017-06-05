/**
 * Gulp tasks for unit testing JavaScript.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const replace = require('gulp-replace');
const babel = require('gulp-babel');

gulp.task('unit-transpile', () => {
    display.info('Running', "Babel");

    const buildConfig = bc.getBuildConfig();

    return gulp.src(buildConfig.unitTestSrcFolder + '**/*.spec.js')
        .pipe(babel())
        .pipe({SRC_DIST_REPLACE})
        .pipe(gulp.dest(buildConfig.unitTestDistFolder));
});

