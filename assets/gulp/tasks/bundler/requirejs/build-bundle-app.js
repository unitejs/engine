/**
 * Gulp tasks for bundling RequireJS modules.
 */
const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const util = require("util");
const uc = require("./util/unite-config");
const display = require("./util/display");
const clientPackages = require("./util/client-packages");
const asyncUtil = require("./util/async-util");
const gutil = require("gulp-util");
const requireJs = require("requirejs");
const insert = require("gulp-insert");
const sourcemaps = require("gulp-sourcemaps");
const glob = require("glob");

async function findAppFiles (uniteConfig, viewPrefix, cssPrefix) {
    const globAsync = util.promisify(glob);
    let files = null;

    try {
        const jsFiles = await globAsync(path.join(
            uniteConfig.dirs.www.dist,
            "**/!(app-bundle|vendor-bundle|app-bundle-init|vendor-bundle-init|app-module-config).js"
        ));

        files = jsFiles.map(file => file.replace(/(\.js)$/, ""));

        if (viewPrefix) {
            const viewFiles = await globAsync(path.join(
                uniteConfig.dirs.www.dist,
                `**/!(app-bundle|vendor-bundle).${uc.extensionMap(uniteConfig.viewExtensions)}`
            ));

            files = files.concat(viewFiles.map(file => `${viewPrefix}${file}`));
        }

        if (cssPrefix) {
            const cssFiles = await globAsync(path.join(uniteConfig.dirs.www.dist, "**/*.css"));

            files = files.concat(cssFiles.map(file => `${cssPrefix}${file}`));
        }
    } catch (err) {
        display.error("Finding app files", err);
        process.exit(1);
    }

    return files;
}

function performAppOptimize (uniteConfig, buildConfiguration, moduleConfig) {
    return new Promise((resolve, reject) => {
        try {
            const map = {"*": {}};
            const paths = {};

            Object.keys(moduleConfig.map).forEach(key => {
                map["*"][key] = moduleConfig.map[key].replace(/^\.\//, "");
            });

            for (const key in moduleConfig.paths) {
                if (key === moduleConfig.map.text) {
                    moduleConfig.paths[key] = moduleConfig.paths[key].replace(/(\.js)$/, "");
                } else {
                    moduleConfig.paths[key] = "empty:";
                }
                paths[key] = `${uniteConfig.dirs.www.dist}vendor-bundle`;
            }

            moduleConfig.packages.forEach(pkg => {
                moduleConfig.paths[pkg.name] = "empty:";
                paths[pkg.name] = `${uniteConfig.dirs.www.dist}vendor-bundle`;
            });

            requireJs.optimize({
                "baseUrl": "./",
                "generateSourceMaps": buildConfiguration.sourcemaps,
                "logLevel": 2,
                "name": `${uniteConfig.dirs.www.dist.replace(/^\.\//, "")}app-bundle-init`,
                "optimize": buildConfiguration.minify ? "uglify" : "none",
                "out": path.join(uniteConfig.dirs.www.dist, "app-bundle.js"),
                "paths": moduleConfig.paths,
                map,
                "exclude": [moduleConfig.map.text]
            }, async (result) => {
                display.log(result);

                let bootstrap = "require.config({";
                bootstrap += `paths: ${JSON.stringify(paths)},`;
                bootstrap += `map: ${JSON.stringify(map)}`;
                bootstrap += "});";
                if (moduleConfig.preload.length > 0) {
                    bootstrap += `require(${JSON.stringify(moduleConfig.preload)}, function() {`;
                }
                bootstrap += `require(['${uniteConfig.dirs.www.dist.replace(/^\.\//, "")}entryPoint']);`;
                if (moduleConfig.preload.length > 0) {
                    bootstrap += "});";
                }

                await asyncUtil.stream(gulp.src(path.join(uniteConfig.dirs.www.dist, "app-bundle.js"))
                    .pipe(buildConfiguration.sourcemaps
                        ? sourcemaps.init({"loadMaps": true}) : gutil.noop())
                    .pipe(insert.append(bootstrap))
                    .pipe(buildConfiguration.sourcemaps
                        ? sourcemaps.write({"includeContent": true}) : gutil.noop())
                    .pipe(gulp.dest(uniteConfig.dirs.www.dist)));

                resolve();
            }, (err) => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

gulp.task("build-bundle-app", async () => {
    const uniteConfig = await uc.getUniteConfig();

    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    if (buildConfiguration.bundle) {
        display.info("Running", "Require js optimizer for App");

        const moduleConfig = clientPackages.buildModuleConfig(
            uniteConfig,
            ["app", "both"],
            buildConfiguration.minify
        );

        const textPrefix = moduleConfig.map.text === undefined ? undefined : "text!";
        const cssPrefix = moduleConfig.map.css === undefined ? textPrefix
            : `${clientPackages.getTypeMap(uniteConfig, "css", buildConfiguration.minify)}!`;

        const files = await findAppFiles(uniteConfig, textPrefix, cssPrefix);

        try {
            await util.promisify(fs.writeFile)(
                path.join(uniteConfig.dirs.www.dist, "app-bundle-init.js"),
                `define(${JSON.stringify(files)}, function () {});`
            );
        } catch (err) {
            display.error("Writing app-bundle-init.js", err);
            process.exit(1);
        }

        try {
            await performAppOptimize(uniteConfig, buildConfiguration, moduleConfig);
        } catch (err) {
            display.error("Performing Optimize", err);
            process.exit(1);
        }
    }
});

/* Generated by UniteJS */
