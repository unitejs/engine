/**
 * Gulp tasks for building JavaScript.
 */
const display = require('./util/display');
const template = require('./util/template');
const modules = require('./util/modules');
const bc = require('./util/build-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const babel = require('gulp-babel');
const path = require('path');
const os = require('os');
const del = require('del');
const uniteConfiguration = require('../../unite.json');

gulp.task('clean', (callback) => {
    const buildConfig = bc.getBuildConfig();
    const folder = path.resolve(buildConfig.distFolder);
    display.info('Cleaning', folder);
    return del(folder, callback);
});

gulp.task('transpile', ['clean'], () => {
    display.info('Running', "Babel");

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

    return gulp.src(buildConfig.srcFolder + '**/*.js')
        .pipe(sourceMapPlaceholderInit)
        .pipe(babel())
        .pipe(sourceMapPlaceholderWrite)
        .pipe(gulp.dest(buildConfig.distFolder));
});

gulp.task('generate-index', ['transpile'], () => {
    display.info('Generating', "index.html from index.html.template");

    const buildConfig = bc.getBuildConfig();
    const moduleConfig = path.join(buildConfig.distFolder, "module-config.js")

    return template.copyTemplate("index.html.template", "index.html", moduleConfig.replace(/\\/g, '/'), uniteConfiguration, "node_modules");
});

gulp.task('generate-module-config', ['generate-index'], (cb) => {
    const buildConfig = bc.getBuildConfig();
    
    display.info('Generating Module Configuration', "module-config.js");
    modules.createModuleConfig(path.join(buildConfig.distFolder, "module-config.js"), "index.html", uniteConfiguration, "node_modules", cb);
});

gulp.task('build', ['generate-module-config'], () => {
});

