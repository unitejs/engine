/**
 * Gulp tasks for building JavaScript.
 */
const display = require('./util/display');
const template = require('./util/template');
const modules = require('./util/modules');
const uc = require('./util/unite-config');
const buildTranspile = require('./build-transpile');
const buildBundle = require('./build-bundle');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const path = require('path');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('build-clean', (callback) => {
    const uniteConfig = uc.getUniteConfig();
    const toClean = path.resolve(uniteConfig.directories.dist);
    display.info('Cleaning', toClean);
    return del(toClean, callback);
});

gulp.task('build-generate-index', () => {
    display.info('Generating', "index.html from index.html.template");

    const uniteConfig = uc.getUniteConfig();
    const moduleConfig = path.join(uniteConfig.directories.dist, "module-config.js")

    return template.copyTemplate("index.html.template", "index.html", moduleConfig.replace(/\\/g, '/'), uniteConfig, "node_modules");
});

gulp.task('build-generate-module-config', (cb) => {
    const uniteConfig = uc.getUniteConfig();
    
    display.info('Generating Module Configuration', "module-config.js");
    modules.createModuleConfig(path.join(uniteConfig.directories.dist, "module-config.js"), "index.html", uniteConfig, "node_modules", cb);
});

gulp.task('build', (cb) => {
    runSequence('build-clean', 'build-transpile', 'build-bundle', 'build-generate-index', 'build-generate-module-config', cb);
});

