/**
 * Gulp tasks for linting modules.
 */
const display = require('./util/display');
const gulp = require('gulp');
const tslint = require('gulp-tslint');
const path = require('path');
const uc = require('./util/unite-config');

gulp.task('build-lint', function () {
    display.info('Running', "TSLint");

    const uniteConfig = uc.getUniteConfig();

    return gulp.src(path.join(uniteConfig.directories.src, '**/*.ts'))
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
        .on('error', function () {
            process.exit(1);
        });
});

