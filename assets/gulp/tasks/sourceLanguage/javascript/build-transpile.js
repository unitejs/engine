/**
 * Gulp tasks for building JavaScript.
 */
const display = require('./util/display');
const uc = require('./util/unite-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const babel = require('gulp-babel');
const path = require('path');
const sourceMaps = require('gulp-sourcemaps');

gulp.task('build-transpile', () => {
    display.info('Running', "Babel");

    const uniteConfig = uc.getUniteConfig();

    return gulp.src(path.join(uniteConfig.directories.src, '**/*.js'))
        .pipe(sourceMaps.init())
        .pipe(babel())
        .pipe(sourceMaps.mapSources(function(sourcePath, file) {
            return './src/' + sourcePath;
        }))
        .pipe(sourceMaps.write({ includeContent: true, sourceRoot: '' }))
        .pipe(gulp.dest(uniteConfig.directories.dist));
});

