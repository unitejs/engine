/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const gulp = require('gulp');

gulp.task('unit-run-test', () => {
    display.info('Running', 'Karma');
});
