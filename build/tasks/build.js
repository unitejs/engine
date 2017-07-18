const gulp = require('gulp');
const tsc = require('gulp-typescript');
const gulpTslint = require("gulp-tslint");
const tslint = require("tslint");
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const mocha = require('gulp-mocha');
const path = require('path');
const merge = require('merge2');
const runSequence = require('run-sequence');

const tsConfigFile = './tsconfig.json';
const srcFolder = './src/';
const distFolder = './dist/';
const testFolder = 'test/';
const tsSrcGlob = srcFolder + '**/*.ts';
const cleanTestGlob = testFolder + '/**/*.js';
const tsTestGlob = testFolder + '**/*.spec.ts';
const jsTestGlob = testFolder + '**/*.spec.js';

const tsProject = tsc.createProject(tsConfigFile);

gulp.task('build-clean', (cb) => {
    return del(distFolder, cb);
});

gulp.task('build-lint', () => {
    var program = tslint.Linter.createProgram(tsConfigFile);

    return gulp.src(tsSrcGlob)
        .pipe(gulpTslint({
            program
        }))
        .pipe(gulpTslint.report());
});

gulp.task('build-transpile', () => {
    let errorCount = 0;
        
    var tsResult = gulp.src(tsSrcGlob)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on("error", (err) => {
            errorCount++;
        })

    return merge([
        tsResult.dts
            .pipe(gulp.dest(distFolder)),
        tsResult.js
            .pipe(sourcemaps.write({ includeContent: false, sourceRoot: '../src' }))
            .pipe(gulp.dest(distFolder))
            .on('end', () => {
                if (errorCount > 0) {
                    process.exit();
                }
            })
    ]);
});

gulp.task('build', (cb) => {
    runSequence('build-clean', 'build-transpile', 'build-lint', cb);
});
