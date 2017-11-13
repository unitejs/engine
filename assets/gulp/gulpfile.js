const gulp = require("gulp");
const tsc = require("gulp-typescript");
const gulpTslint = require("gulp-tslint");
const replace = require("gulp-replace");
const tslint = require("tslint");
const del = require("del");
const merge = require("merge2");
const runSequence = require("run-sequence");
const beautify = require("gulp-jsbeautifier");

const tsConfigFile = "./tsconfig.json";

const srcFolder = "./src/";
const distFolder = "./dist/";
const srcGlob = `${srcFolder}**/*.ts`;
const distGlob = `${distFolder}**/*`;

gulp.task("build-clean", (cb) => {
    return del(distGlob, cb);
});

gulp.task("build-lint", () => {
    const program = tslint.Linter.createProgram(tsConfigFile);

    return gulp.src(srcGlob)
        .pipe(gulpTslint({
            "formatter": "verbose",
            program
        }))
        .pipe(gulpTslint.report())
        .on("error", () => {
            process.exit(1);
        });
});

gulp.task("build-transpile", () => {
    const tsProject = tsc.createProject(tsConfigFile);

    let errorCount = 0;

    const tsResult = gulp.src(srcGlob)
        .pipe(tsProject())
        .on("error", () => {
            errorCount++;
        });

    const streams = [];

    streams.push(tsResult.js
        .pipe(replace(/Object\.defineProperty\(exports, "__esModule", { value: true }\);(\s*)/, ""))
        .pipe(beautify({
            "end_with_newline": true
        }))
        .pipe(gulp.dest(distFolder))
        .on("end", () => {
            if (errorCount > 0) {
                process.exit(1);
            }
        }));

    return merge(streams);
});

gulp.task("build", (cb) => {
    runSequence("build-clean", "build-transpile", "build-lint", cb);
});
