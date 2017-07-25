const gulp = require("gulp");
const tsc = require("gulp-typescript");
const gulpTslint = require("gulp-tslint");
const tslint = require("tslint");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const mocha = require("gulp-mocha");
const merge = require("merge2");
const runSequence = require("run-sequence");

const tsConfigFile = "./tsconfig.json";
const srcFolder = "./src/";
const distFolder = "./dist/";
const testFolder = "test/";
const tsSrcGlob = `${srcFolder}**/*.ts`;
const cleanTestGlob = `${testFolder}/**/*.js`;
const tsTestGlob = `${testFolder}**/*.spec.ts`;

gulp.task("build-clean", (cb) => {
    return del(distFolder, cb);
});

gulp.task("build-lint", () => {
    const program = tslint.Linter.createProgram(tsConfigFile);

    return gulp.src(tsSrcGlob)
        .pipe(gulpTslint({
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

    const tsResult = gulp.src(tsSrcGlob)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on("error", () => {
            errorCount++;
        });

    return merge([
        tsResult.dts
            .pipe(gulp.dest(distFolder)),
        tsResult.js
            .pipe(sourcemaps.write({"includeContent": false, "sourceRoot": "../src"}))
            .pipe(gulp.dest(distFolder))
            .on("end", () => {
                if (errorCount > 0) {
                    process.exit();
                }
            })
    ]);
});

gulp.task("build", (cb) => {
    runSequence("build-clean", "build-transpile", "build-lint", cb);
});

gulp.task("test-clean", (cb) => {
    return del(cleanTestGlob, cb);
});

gulp.task("test-lint", () => {
    const program = tslint.Linter.createProgram(tsConfigFile);

    return gulp.src(tsTestGlob)
        .pipe(gulpTslint({
            program
        }))
        .pipe(gulpTslint.report())
        .on("error", () => {
            process.exit(1);
        });
});

gulp.task("test-transpile", () => {
    const tsProject = tsc.createProject(tsConfigFile);

    const tsResult = gulp.src(tsTestGlob)
        .pipe(tsProject());

    return tsResult.js
        .pipe(gulp.dest(testFolder))
        .pipe(mocha({
            "reporter": "spec",
            "timeout": "360000"
        }))
        .once("error", () => {
            process.exit(1);
        });
});

gulp.task("test", (cb) => {
    runSequence("test-clean", "test-transpile", "test-lint", cb);
});

gulp.task("clean-all", ["build-clean", "test-clean"]);
