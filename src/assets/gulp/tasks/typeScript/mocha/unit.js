/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const gulp = require('gulp');
const typescript = require('gulp-typescript');
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
    display.info('Running', "TypeScript");

    const buildConfig = bc.getBuildConfig();

    const tsProject = typescript.createProject('tsconfig.json', { lib: ["es2015"], allowJs: true });

    return gulp.src(buildConfig.unitTestSrcFolder + '**/*.spec.ts')
            .pipe(tsProject())
            .js
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

