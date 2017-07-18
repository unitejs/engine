/**
 * Gulp tasks for building TypeScript.
 */
const display = require("./util/display");
const uc = require("./util/unite-config");
const gulp = require("gulp");
const typescript = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const path = require("path");
const uglify = require("gulp-uglify");
const gutil = require("gulp-util");

gulp.task("build-transpile", () => {
    display.info("Running", "TypeScript");

    const uniteConfig = uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(true);

    const tsProject = typescript.createProject("tsconfig.json");
    let errorCount = 0;

    return gulp.src(path.join(uniteConfig.directories.src, "**/*.ts"))
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.init() : gutil.noop())
        .pipe(tsProject())
        .on("error", () => {
            errorCount++;
        })
        .js
        .pipe(buildConfiguration.minify ? uglify()
            .on("error", (err) => {
                display.error(err.toString());
            }) : gutil.noop())
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.mapSources((sourcePath) => `./src/${sourcePath}`) : gutil.noop())
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.write({
            "includeContent": true,
            "sourceRoot": ""
        }) : gutil.noop())
        .pipe(gulp.dest(uniteConfig.directories.dist))
        .on("end", () => {
            if (errorCount > 0) {
                process.exit();
            }
        });
});

/* Generated by UniteJS */
