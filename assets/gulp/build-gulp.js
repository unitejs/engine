const gulp = require("gulp");
const runSequence = require("run-sequence");
const del = require("del");
const tsc = require("gulp-typescript");
const replace = require("gulp-replace");
const beautify = require("gulp-jsbeautifier");
const tslint = require("tslint");
const gulpTslint = require("gulp-tslint");

const tsGulpConfigFile = "./assets/gulp/tsconfig.json";
const srcGulpFolder = "./assets/gulp/src/";
const distGulpFolder = "./assets/gulp/dist/";
const srcGulpGlob = `${srcGulpFolder}**/*.ts`;
const distGulpGlob = `${distGulpFolder}**/*`;

gulp.task("build-gulp-clean", (cb) => {
    return del(distGulpGlob, cb);
});

gulp.task("build-gulp-lint", () => {
    const program = tslint.Linter.createProgram(tsGulpConfigFile);

    return gulp.src(srcGulpGlob)
        .pipe(gulpTslint({
            "formatter": "verbose",
            program
        }))
        .pipe(gulpTslint.report())
        .on("error", () => {
            process.exit(1);
        });
});

gulp.task("build-gulp-transpile", () => {
    const tsProject = tsc.createProject(tsGulpConfigFile);

    let errorCount = 0;

    const tsResult = gulp.src(srcGulpGlob)
        .pipe(tsProject())
        .on("error", () => {
            errorCount++;
        });

    return tsResult.js
        .pipe(replace(/Object\.defineProperty\(exports, "__esModule", { value: true }\);(\s*)/, ""))
        .pipe(beautify({
            "end_with_newline": true
        }))
        .pipe(gulp.dest(distGulpFolder))
        .on("end", () => {
            if (errorCount > 0) {
                process.exit(1);
            }
        });
});

gulp.task("build-gulp", (cb) => {
    runSequence("build-gulp-clean", "build-gulp-transpile", "build-gulp-lint", cb);
});

