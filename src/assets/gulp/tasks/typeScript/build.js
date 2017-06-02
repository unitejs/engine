/**
 * Gulp tasks for building TypeScript.
 */
const display = require('./util/display');
const template = require('./util/template');
const modules = require('./util/modules');
const bc = require('./util/build-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const typescript = require('gulp-typescript');
const path = require('path');
const os = require('os');
const del = require('del');
const uniteConfiguration = require('../../unite.json');

gulp.task('build-clean', (callback) => {
    const buildConfig = bc.getBuildConfig();
    const toClean = path.resolve(buildConfig.distFolder);
    display.info('Cleaning', toClean);
    return del(toClean, callback);
});

gulp.task('build-transpile', ['build-clean'], () => {
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

gulp.task('build-generate-index', ['build-transpile'], () => {
    display.info('Generating', "index.html from index.html.template");

    const buildConfig = bc.getBuildConfig();
    const moduleConfig = path.join(buildConfig.distFolder, "module-config.js")

    return template.copyTemplate("index.html.template", "index.html", moduleConfig.replace(/\\/g, '/'), uniteConfiguration, "node_modules");
});

gulp.task('build-generate-module-config', ['build-generate-index'], (cb) => {
    const buildConfig = bc.getBuildConfig();
    
    display.info('Generating Module Configuration', "module-config.js");
    modules.createModuleConfig(path.join(buildConfig.distFolder, "module-config.js"), "index.html", uniteConfiguration, "node_modules", cb);
});

gulp.task('build', ['build-generate-module-config'], () => {
});

