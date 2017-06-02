/**
 * Gulp tasks for building JavaScript.
 */
const display = require('./util/display');
const template = require('./util/template');
const modules = require('./util/modules');
const bc = require('./util/build-config');
const buildTranspile = require('./build-transpile');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const path = require('path');
const del = require('del');
const runSequence = require('run-sequence');

const uniteConfiguration = require('../../unite.json');

gulp.task('build-clean', (callback) => {
    const buildConfig = bc.getBuildConfig();
    const toClean = path.resolve(buildConfig.distFolder);
    display.info('Cleaning', toClean);
    return del(toClean, callback);
});

gulp.task('build-generate-index', () => {
    display.info('Generating', "index.html from index.html.template");

    const buildConfig = bc.getBuildConfig();
    const moduleConfig = path.join(buildConfig.distFolder, "module-config.js")

    return template.copyTemplate("index.html.template", "index.html", moduleConfig.replace(/\\/g, '/'), uniteConfiguration, "node_modules");
});

gulp.task('build-generate-module-config', (cb) => {
    const buildConfig = bc.getBuildConfig();
    
    display.info('Generating Module Configuration', "module-config.js");
    modules.createModuleConfig(path.join(buildConfig.distFolder, "module-config.js"), "index.html", uniteConfiguration, "node_modules", cb);
});

gulp.task('build', (cb) => {
    runSequence('build-clean', 'build-transpile', 'build-generate-index', 'build-generate-module-config', cb);
});

