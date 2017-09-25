/**
 * Gulp tasks for linting modules.
 */
const display = require("./util/display");
const gulp = require("gulp");
const eslint = require("gulp-eslint");
const path = require("path");
const uc = require("./util/unite-config");
const asyncUtil = require("./util/async-util");

gulp.task("build-lint", async () => {
    display.info("Running", "ESLint");

    const uniteConfig = await uc.getUniteConfig();

    let localResolve = null;
    return asyncUtil.stream(gulp.src(path.join(
        uniteConfig.dirs.www.src,
        `**/*.${uc.extensionMap(uniteConfig.sourceExtensions)}`
    ))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.results(result => {
            if (result.errorCount === 0) {
                localResolve();
            } else {
                process.exit(1);
            }
        })), (resolve) => {
        localResolve = resolve;
    });
});

/* Generated by UniteJS */
