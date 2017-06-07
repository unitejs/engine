/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const unitTranspile = require('./unit-transpile');
const unitRunner = require('./unit-runner');
const gulp = require('gulp');
const path = require('path');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('unit-clean', (callback) => {
    const buildConfig = bc.getBuildConfig();
    const toClean = path.join(path.resolve(buildConfig.unitTestDistFolder), "**/*.spec.js");
    display.info('Cleaning', toClean);
    return del(toClean, callback);
});

gulp.task('unit', (cb) => {
    runSequence('unit-clean', 'unit-transpile', 'unit-bundle', 'unit-run-test', cb);
});

gulp.task('unit-ui', (cb) => {
    runSequence('unit-clean', 'unit-transpile', 'unit-bundle', 'unit-run-test-ui', cb);
});

