/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const uc = require('./util/unite-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const replace = require('gulp-replace');
const typescript = require('gulp-typescript');
const sourceMaps = require('gulp-sourcemaps');

gulp.task('unit-transpile', () => {
    display.info('Running', "TypeScript");

    const uniteConfig = uc.getUniteConfig();

    const regEx = new RegExp(uniteConfig.srcDistReplace, 'g');

    const tsProject = typescript.createProject('tsconfig.json');

    return gulp.src(uniteConfig.directories.unitTestSrc + '**/*.spec.ts')
        .pipe(sourceMaps.init())
        .pipe(tsProject())
        .on("error", function () {
            process.exit(1);
        })
        .js
            .pipe(replace(regEx, uniteConfig.srcDistReplaceWith))
            .pipe(sourceMaps.write({ includeContent: true }))
            .pipe(gulp.dest(uniteConfig.directories.unitTestDist));
});
