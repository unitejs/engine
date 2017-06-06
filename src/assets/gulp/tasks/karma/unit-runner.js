/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const gulp = require('gulp');
const path = require('path');
const karma = require('karma');

gulp.task('unit-run-test', (done) => {
    display.info('Running', 'Karma');

    const buildConfig = bc.getBuildConfig();

    const unitFiles = [];

    {UNIT_FILES}
    unitFiles.push({ pattern: path.join(buildConfig.distFolder, '**/*.js'), included: false });
    unitFiles.push({ pattern: path.join(buildConfig.unitTestDistFolder, '**/*.spec.js'), included: false });
    unitFiles.push({ pattern: path.join(buildConfig.unitTestDistFolder, '../unitBootstrap.js'), included: true });

    const serverOpts = {
        'singleRun': true,
        'frameworks': {KARMA_FRAMEWORKS},
        'reporters': ['story'],
        'browsers': ['PhantomJS'],
        'files': unitFiles
    };

    const server = new karma.Server(serverOpts, function (exitCode) {
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

    const buildConfig = bc.getBuildConfig();

    const unitFiles = [];

    {UNIT_FILES}
    unitFiles.push({ pattern: path.join(buildConfig.distFolder, "**/*.js"), included: false });
    unitFiles.push({ pattern: path.join(buildConfig.unitTestDistFolder, "**/*.spec.js"), included: false });
    unitFiles.push({ pattern: path.join(buildConfig.unitTestDistFolder, '../unitBootstrap.js'), included: true });

    const serverOpts = {
        'singleRun': false,
        'frameworks': {KARMA_FRAMEWORKS},
        'browsers': ['Chrome'],
        'files': unitFiles
    };

    const server = new karma.Server(serverOpts, function (exitCode) {
        if (exitCode === 0) {
            done();
        } else {
            process.exit(exitCode);
        }
    });

    server.start();

});
