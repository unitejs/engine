/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const uc = require('./util/unite-config');
const unitTranspile = require('./unit-transpile');
const unitRunner = require('./unit-runner');
const unitLint = require('./unit-lint');
const gulp = require('gulp');
const path = require('path');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('unit-clean', (callback) => {
    const uniteConfig = uc.getUniteConfig();
    const toClean = [
        path.join(path.resolve(uniteConfig.directories.unitTestDist), "**/*.spec.js"),
        path.join(path.resolve(uniteConfig.directories.reports), "**/*"),
    ];
    display.info('Cleaning', toClean);
    return del(toClean, callback);
});

gulp.task('unit', (cb) => {
    runSequence('unit-clean', 'unit-lint', 'unit-transpile', 'unit-run-test', cb);
});

gulp.task('unit-ui', (cb) => {
    runSequence('unit-clean', 'unit-lint', 'unit-transpile', 'unit-run-test-ui', cb);
});

