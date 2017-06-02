/**
 * Gulp tasks for building TypeScript.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const typescript = require('gulp-typescript');

gulp.task('build-transpile', () => {
    display.info('Running', "TypeScript");

    const buildConfig = bc.getBuildConfig();

    let sourceMapPlaceholderInit;
    let sourceMapPlaceholderWrite;

    if (buildConfig.sourceMaps) {
        const sourceMaps = require('gulp-sourcemaps');
        sourceMapPlaceholderInit = sourceMaps.init();
        sourceMapPlaceholderWrite = sourceMaps.write({includeContent: true});
    } else {
        sourceMapPlaceholderInit = gulpUtil.noop();
        sourceMapPlaceholderWrite = gulpUtil.noop();
    }

    const tsProject = typescript.createProject('tsconfig.json');

    return gulp.src(buildConfig.srcFolder + '**/*.ts')
            .pipe(sourceMapPlaceholderInit)
            .pipe(tsProject())
            .js
                .pipe(sourceMapPlaceholderWrite)
                .pipe(gulp.dest(buildConfig.distFolder));
});
