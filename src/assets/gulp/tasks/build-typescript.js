/**
 * Gulp tasks for building TypeScript.
 */
const display = require('./util/display');
const template = require('./util/template');
const pipes = require('./util/pipes');
const bc = require('./util/build-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const typescript = require('gulp-typescript');
const path = require('path');
const del = require('del');
const uniteConfiguration = require('../../unite.json');

gulp.task('clean', (callback) => {
    const buildConfig = bc.getBuildConfig();
    const folder = path.resolve(buildConfig.distFolder);
    display.info('Cleaning', folder);
    return del(folder, callback);
});

gulp.task('transpile', ['clean'], () => {
    display.info('Running', "TypeScript");
    const buildConfig = bc.getBuildConfig();

    let sourceMapPlaceholderInit;
    let sourceMapPlaceholderWrite;

    if (buildConfig.sourceMaps) {
        const sourceMaps = require('gulp-sourcemaps');
        sourceMapPlaceholderInit = sourceMaps.init();
        sourceMapPlaceholderWrite = sourceMaps.write({includeContent: false, sourceRoot: path.relative(buildConfig.distFolder, buildConfig.srcFolder)});
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

gulp.task('copy-template', ['transpile'], () => {
    display.info('Generating', "index.html from index.html.template");
    return template.copyTemplate("index.html.template", uniteConfiguration, "node_modules");
});

gulp.task('build', ['copy-template'], () => {
});

