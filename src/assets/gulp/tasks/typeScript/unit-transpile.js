/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const replace = require('gulp-replace');
const typescript = require('gulp-typescript');

gulp.task('unit-transpile', () => {
    display.info('Running', "TypeScript");

    const buildConfig = bc.getBuildConfig();

    const tsProject = typescript.createProject('tsconfig.json');

    return gulp.src(buildConfig.unitTestSrcFolder + '**/*.spec.ts')
            .pipe(tsProject())
            .js
                .pipe({SRC_DIST_REPLACE})
                .pipe(gulp.dest(buildConfig.unitTestDistFolder));
});
