/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const uc = require('./util/unite-config');
const gulp = require('gulp');
const path = require('path');
const karma = require('karma');

gulp.task('unit-run-test', (done) => {
    display.info('Running', 'Karma');

    const uniteConfig = uc.getUniteConfig();

    const serverOpts = {
        singleRun: true,
        frameworks: uniteConfig.testFrameworks,
        reporters: ['story', 'coverage', 'html'],
        browsers: ['PhantomJS'],
        files: uniteConfig.testIncludes,
        coverageReporter: {
            reporters: [
                {
                    type: 'json',
                    dir: uniteConfig.directories.reports,
                    subdir: '.'
                }
            ]
        },
        htmlReporter: {
            outputDir: uniteConfig.directories.reports,
            reportName: 'unit'
        }
    };

    const distFolder = path.join(uniteConfig.directories.dist, '**/*.js');
    serverOpts.preprocessors = {};
    serverOpts.preprocessors[distFolder] = ['sourcemap', 'coverage'];

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

    const uniteConfig = uc.getUniteConfig();

    const serverOpts = {
        singleRun: false,
        frameworks: uniteConfig.testFrameworks,
        browsers: ['Chrome'],
        files: uniteConfig.testIncludes
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
