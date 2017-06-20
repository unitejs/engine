/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const gulp = require('gulp');
const path = require('path');
const karma = require('karma');

gulp.task('unit-run-test', (done) => {
    display.info('Running', 'Karma');

    const server = new karma.Server({
         configFile: '../../../karma.conf.js',
    }, function (exitCode) {
        if (exitCode === 0) {
            done();
        } else {
            process.exit(exitCode);
        }
    });

    server.start();
});

gulp.task('unit-run-test-ui', (done) => {
    display.info('Running', 'Karma');

    const server = new karma.Server({
         configFile: '../../../karma.conf.js',
         browsers: ['Chrome'],
         singleRun: false
    }, function (exitCode) {
        if (exitCode === 0) {
            done();
        } else {
            process.exit(exitCode);
        }
    });

    server.start();
});