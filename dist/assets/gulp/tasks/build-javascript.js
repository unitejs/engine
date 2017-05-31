/**
 * Gulp tasks for building JavaScript.
 */
const display = require('./util/display');
const template = require('./util/template');
const bc = require('./util/build-config');
const gulp = require('gulp');
const babel = require('gulp-babel');
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
    display.info('Running', "Babel");
    const buildConfig = bc.getBuildConfig();
    return gulp.src(buildConfig.srcFolder + '**/*.js')
        .pipe(babel())
        .pipe(gulp.dest(buildConfig.distFolder));
});

gulp.task('copy-template', ['transpile'], () => {
    display.info('Generating', "index.html from index.html.template");
    return template.copyTemplate("index.html.template", uniteConfiguration, "node_modules");
});

gulp.task('build', ['copy-template'], () => {
});

