/**
 * Gulp tasks for building TypeScript.
 */
const display = require('./util/display');
const uc = require('./util/unite-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const typescript = require('gulp-typescript');
const sourceMaps = require('gulp-sourcemaps');
const path = require('path');

gulp.task('build-transpile', () => {
    display.info('Running', "TypeScript");

    const uniteConfig = uc.getUniteConfig();

    const tsProject = typescript.createProject('tsconfig.json');

    return gulp.src(path.join(uniteConfig.directories.src, '**/*.ts'))
        .pipe(sourceMaps.init())
        .pipe(tsProject())
        .js
            .pipe(sourceMaps.mapSources(function (sourcePath, file) {
                return './src/' + sourcePath;
            }))
            .pipe(sourceMaps.write({ includeContent: true, sourceRoot: '' }))
            .pipe(gulp.dest(uniteConfig.directories.dist));
});
