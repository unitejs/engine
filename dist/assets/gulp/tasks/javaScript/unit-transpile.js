/**
 * Gulp tasks for unit testing JavaScript.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('unit-transpile', () => {
    display.info('Running', "Babel");

    const buildConfig = bc.getBuildConfig();

    return gulp.src(buildConfig.unitTestSrcFolder + '**/*.spec.js')
        .pipe(babel())
        .pipe(gulp.dest(buildConfig.unitTestDistFolder));
});

