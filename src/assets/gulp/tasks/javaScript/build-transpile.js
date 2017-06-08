/**
 * Gulp tasks for building JavaScript.
 */
const display = require('./util/display');
const uc = require('./util/unite-config');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const babel = require('gulp-babel');
const sourceMaps = require('gulp-sourcemaps');

gulp.task('build-transpile', () => {
    display.info('Running', "Babel");

    const uniteConfig = uc.getUniteConfig();

    return gulp.src(uniteConfig.directories.src + '**/*.js')
        .pipe(sourceMaps.init())
        .pipe(babel())
        .pipe(sourceMaps.write({includeContent: true}))
        .pipe(gulp.dest(uniteConfig.directories.dist));
});

