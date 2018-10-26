/**
 * Gulp tasks for bundling RequireJS modules.
 */
import * as fs from "fs";
import * as glob from "glob";
import * as gulp from "gulp";
import * as insert from "gulp-insert";
import * as sourcemaps from "gulp-sourcemaps";
import * as path from "path";
import * as requireJs from "requirejs";
import * as through2 from "through2";
import * as util from "util";
import { IModuleConfig } from "../../../types/IModuleConfig";
import { IUniteBuildConfiguration } from "../../../types/IUniteBuildConfiguration";
import { IUniteConfiguration } from "../../../types/IUniteConfiguration";
import * as asyncUtil from "../../util/async-util";
import * as clientPackages from "../../util/client-packages";
import * as display from "../../util/display";
import * as uc from "../../util/unite-config";

async function findAppFiles(uniteConfig: IUniteConfiguration, viewPrefix: string, cssPrefix: string): Promise<string[]> {
    const globAsync = util.promisify<string, string[]>(glob);
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

async function performAppOptimize(uniteConfig: IUniteConfiguration, buildConfiguration: IUniteBuildConfiguration, moduleConfig: IModuleConfig): Promise<void> {
    return new Promise<void>(async(resolve, reject) => {
        try {
            const map: { [id: string]: { [id: string]: string}} = { "*": {} };
            const paths: { [id: string]: string} = {};

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
                                baseUrl: "./",
                                generateSourceMaps: buildConfiguration.sourcemaps,
                                logLevel: 2,
                                name: `${uniteConfig.dirs.www.dist.replace(/^\.\//, "")}app-bundle-init`,
                                optimize: buildConfiguration.minify ? "uglify" : "none",
                                out: path.join(uniteConfig.dirs.www.dist, "app-bundle.js"),
                                paths: moduleConfig.paths,
                                map,
                                exclude: [moduleConfig.map.text]
                            },
                               async (result) => {
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
                                            ? sourcemaps.init({ loadMaps: true }) : through2.obj())
                                        .pipe(insert.append(bootstrap))
                                        .pipe(buildConfiguration.sourcemaps
                                            ? sourcemaps.write({ includeContent: true }) : through2.obj())
                                        .pipe(gulp.dest(uniteConfig.dirs.www.dist)));

                                    resolve();
                                },
                               async (err) => {
                                    reject(err);
                                });
        } catch (err) {
            reject(err);
        }
    });
}

gulp.task("build-bundle-app", async () => {
    const uniteConfig = await uc.getUniteConfig();

    const buildConfiguration = uc.getBuildConfiguration(uniteConfig, false);

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

// Generated by UniteJS
