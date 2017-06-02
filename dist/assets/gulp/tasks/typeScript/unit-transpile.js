/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const bc = require('./util/build-config');
const gulp = require('gulp');
const typescript = require('gulp-typescript');

gulp.task('unit-transpile', () => {
    display.info('Running', "TypeScript");

    const buildConfig = bc.getBuildConfig();

    const tsProject = typescript.createProject('tsconfig.json', { lib: ["es2015"], allowJs: true });

    return gulp.src(buildConfig.unitTestSrcFolder + '**/*.spec.ts')
            .pipe(tsProject())
            .js
                .pipe(gulp.dest(buildConfig.unitTestDistFolder));
});
