/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const gulp = require('gulp');
const babel = require('gulp-babel');
const path = require('path');
const del = require('del');
const mocha = require('gulp-mocha');

const uniteConfiguration = require('../../unite.json');

gulp.task('unit-clean', (callback) => {
    const buildConfig = bc.getBuildConfig();
    const toClean = path.join(path.resolve(buildConfig.unitTestDistFolder), "**/*.spec.js");
    display.info('Cleaning', toClean);
    return del(toClean, callback);
});

gulp.task('unit-transpile', ['unit-clean'], () => {
    display.info('Running', "Babel");

    const buildConfig = bc.getBuildConfig();

    return gulp.src(buildConfig.unitTestSrcFolder + '**/*.spec.js')
        .pipe(babel())
        .pipe(gulp.dest(buildConfig.unitTestDistFolder));
});

gulp.task('unit-run-test', ['unit-transpile'], () => {
    display.info('Running Tests');

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

gulp.task('unit', ['unit-run-test'], () => {
});

