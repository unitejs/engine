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
        },
        preprocessors: {}
    };

    if (uniteConfig.testAppPreprocessors && uniteConfig.testAppPreprocessors.length > 0) {
        const appDistFolder = path.join(uniteConfig.directories.dist, '**/*.js');
        serverOpts.preprocessors[appDistFolder] = uniteConfig.testAppPreprocessors;
    }
    if (uniteConfig.testUnitPreprocessors && uniteConfig.testUnitPreprocessors.length > 0) {
        const unitDistFolder = path.join(uniteConfig.directories.unitTestDist, '**/*.spec.js');
        serverOpts.preprocessors[unitDistFolder] = uniteConfig.testUnitPreprocessors;
    }

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
        files: uniteConfig.testIncludes,
        preprocessors: {}
    };

    if (uniteConfig.testAppPreprocessors && uniteConfig.testAppPreprocessors.length > 0) {
        const appDistFolder = path.join(uniteConfig.directories.dist, '**/*.js');
        serverOpts.preprocessors[appDistFolder] = uniteConfig.testAppPreprocessors;
    }
    if (uniteConfig.testUnitPreprocessors && uniteConfig.testUnitPreprocessors.length > 0) {
        const unitDistFolder = path.join(uniteConfig.directories.unitTestDist, '**/*.spec.js');
        serverOpts.preprocessors[unitDistFolder] = uniteConfig.testUnitPreprocessors;
    }

    const server = new karma.Server(serverOpts, function (exitCode) {
        if (exitCode === 0) {
            done();
        } else {
            process.exit(exitCode);
        }
    });

    server.start();
});
