/**
 * Gulp tasks for building JavaScript.
 */
const display = require("./util/display");
const uc = require("./util/unite-config");
const moduleConfig = require("./util/module-config");
const themeUtils = require("./util/theme-utils");
const asyncUtil = require("./util/async-util");
const packageConfig = require("./util/package-config");
const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const util = require("util");
const del = require("del");
const runSequence = require("run-sequence");
const minimist = require("minimist");
const htmlMin = require("gulp-htmlmin");
const deleteEmpty = require("delete-empty");
const envUtil = require("./util/env-util");
const platformUtils = require("./util/platform-utils");
require("./build-transpile");
require("./build-transpile-modules");
require("./build-bundle-app");
require("./build-bundle-vendor");
require("./build-lint");
require("./build-css-app");
require("./build-css-components");
require("./build-css-post-app");
require("./build-css-post-components");

gulp.task("build-clean", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const toClean = [
        path.join(uniteConfig.dirs.www.dist, "**/*"),
        path.join(uniteConfig.dirs.www.cssDist, "**/*"),
        "./index.html",
        "./service-worker.js"
    ];
    display.info("Cleaning", toClean);
    return del(toClean);
});

gulp.task("build-copy-index", async () => {
    display.info("Building Index Page");

    const uniteConfig = await uc.getUniteConfig();
    const uniteThemeConfig = await uc.getUniteThemeConfig(uniteConfig);
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);
    const packageJson = await packageConfig.getPackageJson();

    return themeUtils.buildIndex(uniteConfig, uniteThemeConfig, buildConfiguration, packageJson);
});

gulp.task("build-pre", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    if (buildConfiguration.pwa) {
        const favIcon = path.join(uniteConfig.dirs.www.assets, "favicon/favicon.ico");
        const faviconExists = await asyncUtil.fileExists(favIcon);

        if (!faviconExists) {
            display.warning("Before you can create a PWA build you must build the theme.");
            display.warning(`Update any information in '${path.join(uniteConfig.dirs.www.assetsSrc, "theme/unite-theme.json")}',`);
            display.warning(`and then run 'gulp theme-build'.`);
            process.exit(1);
        }
    }
});

gulp.task("build-create-pwa", async () => {
    display.info("Building PWA Service Worker");

    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    if (buildConfiguration.pwa) {
        const uniteThemeConfig = await uc.getUniteThemeConfig(uniteConfig);
        const packageJson = await packageConfig.getPackageJson();

        const files = await platformUtils.listFiles(
            uniteConfig,
            buildConfiguration
        );

        await themeUtils.buildPwa(uniteConfig, buildConfiguration, packageJson, files, "./", false);

        return themeUtils.buildManifestJson(uniteConfig, uniteThemeConfig, packageJson);
    }
});

gulp.task("build-post-clean", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    const toClean = [];

    if (uniteConfig.cssPost === "None") {
        toClean.push(path.join(uniteConfig.dirs.www.cssDist, "**/main.css"));
    } else {
        toClean.push(path.join(uniteConfig.dirs.www.cssDist, "**/!(style).css"));
    }
    if (buildConfiguration.bundle) {
        toClean.push(path.join(uniteConfig.dirs.www.dist, "**/!(app-bundle|vendor-bundle).*"));
    }
    display.info("Cleaning", toClean);
    try {
        await del(toClean);
        await util.promisify(deleteEmpty)(uniteConfig.dirs.www.dist, {"verbose": false});
    } catch (err) {
        display.error(err);
        process.exit(1);
    }
});

gulp.task("build-index-min", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    if (buildConfiguration.minify) {
        return asyncUtil.stream(gulp.src("./index.html")
            .pipe(htmlMin({"collapseWhitespace": true, "removeComments": true}))
            .pipe(gulp.dest("./")));
    }
});

gulp.task("build-html-min", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    if (buildConfiguration.minify) {
        return asyncUtil.stream(gulp.src(path.join(
            uniteConfig.dirs.www.dist,
            `**/*.${uc.extensionMap(uniteConfig.viewExtensions)}`
        ))
            .pipe(htmlMin({"collapseWhitespace": true, "removeComments": true}))
            .pipe(gulp.dest(uniteConfig.dirs.www.dist)));
    }
});

gulp.task("build-copy-components", async () => {
    const uniteConfig = await uc.getUniteConfig();

    return asyncUtil.stream(gulp.src([path.join(
        uniteConfig.dirs.www.src,
        `**/*.${uc.extensionMap(uniteConfig.viewExtensions)}`
    )])
        .pipe(gulp.dest(uniteConfig.dirs.www.dist)));
});

gulp.task("build-module-config", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    const config = moduleConfig.create(uniteConfig, ["app", "both"], buildConfiguration.bundle, "");

    if (config) {
        try {
            await util.promisify(fs.writeFile)(path.join(uniteConfig.dirs.www.dist, "app-module-config.js"), config);
        } catch (err) {
            display.error("Writing app-module-config.js", err);
            process.exit(1);
        }
    }
});

gulp.task("build-css-all", async () => {
    try {
        await util.promisify(runSequence)(
            "build-css-app",
            "build-css-post-app"
        );
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("build-src-all", async () => {
    try {
        await util.promisify(runSequence)("build-transpile");
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("build-src-view-all", async () => {
    try {
        await util.promisify(runSequence)("build-copy-components");
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("build-src-style-all", async () => {
    try {
        await util.promisify(runSequence)(
            "build-css-components",
            "build-css-post-components",
        );
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("build", async () => {
    const knownOptions = {
        "default": {
            "watch": false
        },
        "boolean": [
            "watch"
        ]
    };

    const options = minimist(process.argv.slice(2), knownOptions);

    envUtil.set("transpileContinueOnError", false);

    try {
        await util.promisify(runSequence)(
            "build-pre",
            "build-clean",
            "build-css-components",
            "build-css-post-components",
            "build-transpile-modules",
            "build-transpile",
            "build-lint",
            "build-css-app",
            "build-css-post-app",
            "build-copy-components",
            "build-module-config",
            "build-html-min",
            "build-bundle-vendor",
            "build-bundle-app",
            "build-copy-index",
            "build-index-min",
            "build-post-clean",
            "build-create-pwa"
        );

        if (options.watch) {
            display.info("Watching for changes");

            envUtil.set("transpileContinueOnError", true);

            const uniteConfig = await uc.getUniteConfig();

            gulp.watch(
                path.join(uniteConfig.dirs.www.src, `**/*.${uc.extensionMap(uniteConfig.sourceExtensions)}`),
                ["build-src-all"]
            );
            gulp.watch(
                path.join(uniteConfig.dirs.www.src, `**/*.${uc.extensionMap(uniteConfig.viewExtensions)}`),
                ["build-src-view-all"]
            );
            gulp.watch(
                path.join(uniteConfig.dirs.www.src, `**/*.${uniteConfig.styleExtension}`),
                ["build-src-style-all"]
            );
            gulp.watch(
                path.join(uniteConfig.dirs.www.cssSrc, `**/*.${uniteConfig.styleExtension}`),
                ["build-css-all"]
            );
        }

    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

/* Generated by UniteJS */
