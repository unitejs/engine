/**
 * Gulp tasks for unit testing JavaScript.
 */
const display = require('./util/display');
const uc = require('./util/unite-config');
const gulp = require('gulp');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('unit-transpile', () => {
    display.info('Running', "Babel");

    const uniteConfig = uc.getUniteConfig();
    let errorCount = 0;

    const regEx = new RegExp(uniteConfig.srcDistReplace, 'g');

    return gulp.src(uniteConfig.directories.unitTestSrc + '**/*.spec.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .on('error', (err) => {
            display.error('error: ' + err.message + '\n');
            display.error(err.codeFrame);
            errorCount++;
        })
        .pipe(replace(regEx, uniteConfig.srcDistReplaceWith))
        .pipe(sourcemaps.write({ includeContent: true }))
        .pipe(gulp.dest(uniteConfig.directories.unitTestDist))
        .on('end', () => {
            if (errorCount > 0) {
                process.exit();
            }
        });
});

/* Generated by UniteJS */
