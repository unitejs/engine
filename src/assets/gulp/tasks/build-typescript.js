/**
 * Gulp tasks for building TypeScript.
 */
const display = require('./util/display');
const template = require('./util/template');
const bc = require('./util/build-config');
const gulp = require('gulp');
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
    const buildConfig = bc.getBuildConfig();

    const tsProject = typescript.createProject('tsconfig.json');

    return gulp.src(buildConfig.srcFolder + '**/*.ts')
            .pipe(tsProject())
            .js
                .pipe(gulp.dest(buildConfig.distFolder));
});

gulp.task('copy-template', ['transpile'], () => {
    return template.copyTemplate("index.html.template", uniteConfiguration, "node_modules");
});

gulp.task('build', ['copy-template'], () => {
});

