/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const template = require('./util/template');
const modules = require('./util/modules');
const bc = require('./util/build-config');
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const path = require('path');
const os = require('os');
const del = require('del');
const mocha = require('gulp-mocha');
const uniteConfiguration = require('../../unite.json');

gulp.task('unit-clean', (callback) => {
    const buildConfig = bc.getBuildConfig();
    const toClean = path.join(path.resolve(buildConfig.unitTestFolder), "**/*.spec.js");
    display.info('Cleaning', toClean);
    return del(toClean, callback);
});

gulp.task('unit-transpile', ['unit-clean'], () => {
    display.info('Running', "TypeScript");

    const buildConfig = bc.getBuildConfig();

    const tsProject = typescript.createProject('tsconfig.json');

    return gulp.src(buildConfig.unitTestFolder + '**/*.spec.ts')
            .pipe(tsProject())
            .js
                .pipe(gulp.dest(buildConfig.unitTestFolder));
});

gulp.task('unit-run-test', ['unit-transpile'], () => {
    display.info('Running Tests');

    const buildConfig = bc.getBuildConfig();

	return gulp.src(buildConfig.unitTestFolder + '**/*.spec.js')
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

