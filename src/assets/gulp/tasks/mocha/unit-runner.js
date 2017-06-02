/**
 * Gulp tasks for unit testing with mocha.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('unit-run-test', () => {
    display.info('Running', 'Mocha');

    const buildConfig = bc.getBuildConfig();

	return gulp.src(buildConfig.unitTestDistFolder + '**/*.spec.js')
        .pipe(mocha({
            reporter: 'spec', 
            timeout: '360000'
        }))
        .once('error', () => {
            process.exit(1);
        });
});

