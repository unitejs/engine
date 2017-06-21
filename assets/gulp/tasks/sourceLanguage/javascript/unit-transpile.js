/**
 * Gulp tasks for unit testing JavaScript.
 */
const display = require('./util/display');
const uc = require('./util/unite-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const sourceMaps = require('gulp-sourcemaps');

gulp.task('unit-transpile', () => {
    display.info('Running', "Babel");

    const uniteConfig = uc.getUniteConfig();

    const regEx = new RegExp(uniteConfig.srcDistReplace, 'g');

    return gulp.src(uniteConfig.directories.unitTestSrc + '**/*.spec.js')
        .pipe(sourceMaps.init())
        .pipe(babel())
        .on('error', function (err) {
            console.log('error: ' + err.message + '\n');
            console.log(err.codeFrame);
            process.exit(1);
        })
        .pipe(replace(regEx, uniteConfig.srcDistReplaceWith))
        .pipe(sourceMaps.write({ includeContent: true }))
        .pipe(gulp.dest(uniteConfig.directories.unitTestDist));
});

