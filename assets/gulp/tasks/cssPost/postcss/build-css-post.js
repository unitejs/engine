/**
 * Gulp tasks for post building css.
 */
const display = require("./util/display");
const gulp = require("gulp");
const path = require("path");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const uc = require("./util/unite-config");
const gutil = require("gulp-util");
const cssnano = require("cssnano");

gulp.task("build-css-post", () => {
    display.info("Running", "PostCss");

    const uniteConfig = uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration();

    return gulp.src(path.join(uniteConfig.directories.cssDist, "main.css"))
        .pipe(rename("style.css"))
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.init() : gutil.noop())
        .pipe(postcss())
        .pipe(buildConfiguration.minify ? postcss([cssnano()]) : gutil.noop())
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.write({
            "includeContent": true,
            "sourceRoot": "./src"
        }) : gutil.noop())
        .pipe(gulp.dest(uniteConfig.directories.cssDist));
});

/* Generated by UniteJS */
