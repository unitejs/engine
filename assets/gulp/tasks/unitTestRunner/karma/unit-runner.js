/**
 * Gulp tasks for karma unit testing.
 */
const display = require("./util/display");
const gulp = require("gulp");
const karma = require("karma");
const minimist = require("minimist");
const uc = require("./util/unite-config");
const jsonHelper = require("./util/json-helper");
const clientPackages = require("./util/client-packages");
const util = require("util");
const fs = require("fs");
const path = require("path");
const envUtil = require("./util/env-util");

function addClientPackageTestFiles (uniteConfig, files) {
    let newFiles = [];
    const newModuleLoaders = [];

    if (files) {
        files.forEach((file => {
            if (file.includeType === "polyfill") {
                newFiles.push(file);
            }
        }));
    }

    const testPackages = clientPackages.getTestPackages(uniteConfig);
    Object.keys(testPackages).forEach(key => {
        const pkg = testPackages[key];
        const addArray = pkg.isModuleLoader ? newModuleLoaders : newFiles;
        const includeType = pkg.isModuleLoader ? "moduleLoader" : "clientPackage";
        if (pkg.main) {
            const mainSplit = pkg.main.split("/");
            let main = mainSplit.pop();
            let location = mainSplit.join("/");

            if (pkg.isPackage) {
                addArray.push({
                    "pattern": `./${path.join(uniteConfig.dirs.www.package, `${key}/${location}/**/*.{js,html,css}`)
                        .replace(/\\/g, "/")}`,
                    "included": pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both",
                    includeType
                });
            } else {
                location += location.length > 0 ? "/" : "";
                if (main === "*") {
                    main = "**/*.{js,html,css}";
                }
                addArray.push({
                    "pattern": `./${path.join(uniteConfig.dirs.www.package, `${key}/${location}${main}`)
                        .replace(/\\/g, "/")}`,
                    "included": pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both",
                    includeType
                });
            }

            if (pkg.testingAdditions) {
                const additionKeys = Object.keys(pkg.testingAdditions);
                additionKeys.forEach(additionKey => {
                    addArray.push({
                        "pattern": `./${path.join(
                            uniteConfig.dirs.www.package,
                            `${key}/${pkg.testingAdditions[additionKey]}`
                        ).replace(/\\/g, "/")}`,
                        "included": pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both",
                        includeType
                    });
                });
            }
        }

        if (testPackages[key].assets !== undefined &&
            testPackages[key].assets !== null &&
            testPackages[key].assets.length > 0) {
            const cas = testPackages[key].assets.split(",");
            cas.forEach((ca) => {
                addArray.push({
                    "pattern": `./${path.join(uniteConfig.dirs.www.package, `${key}/${ca}`)
                        .replace(/\\/g, "/")}`,
                    "included": false,
                    includeType
                });
            });
        }
    });

    newFiles = newFiles.concat(newModuleLoaders);

    if (files) {
        files.forEach((file => {
            if (file.includeType === "fixed") {
                newFiles.push(file);
            }
        }));
    }

    return newFiles;
}

gulp.task("unit-run-test", async () => {
    display.info("Running", "Karma");

    const knownOptions = {
        "default": {
            "grep": "!(*-bundle|app-module-config|entryPoint)",
            "browser": undefined,
            "watch": false
        },
        "string": [
            "grep",
            "browser"
        ],
        "boolean": [
            "watch"
        ]
    };

    const options = minimist(process.argv.slice(2), knownOptions);

    const uniteConfig = await uc.getUniteConfig();

    try {
        let conf = await util.promisify(fs.readFile)("./karma.conf.js");
        conf = conf.toString();
        const jsonMatches = (/config.set\(((.|\n|\r)*)\)/).exec(conf);
        if (jsonMatches.length === 3) {
            const configuration = jsonHelper.parseCode(jsonMatches[1]);
            configuration.files = addClientPackageTestFiles(uniteConfig, configuration.files);
            conf = conf.replace(jsonMatches[1], jsonHelper.codify(configuration));
            await util.promisify(fs.writeFile)("./karma.conf.js", conf);
        } else {
            display.error("Parsing karma.conf.js failed");
            process.exit(1);
        }
    } catch (err) {
        display.error("Parsing karma.conf.js", err);
        process.exit(1);
    }

    const karmaConf = {
        "configFile": "../../../karma.conf.js",
        "coverageReporter": {
            "include": `${uniteConfig.dirs.www.dist}**/${options.grep}.js`
        }
    };

    if (options.browser) {
        karmaConf.singleRun = false;
        karmaConf.browsers = [];
        const overrideBrowsers = options.browser.split(",");
        const allOptions = ["Chrome", "ChromeHeadless", "Edge", "Firefox", "IE", "PhantomJS", "Safari"];

        overrideBrowsers.forEach(browser => {
            const bLower = browser.toLowerCase();
            const found = allOptions.find(option => option.toLowerCase() === bLower);
            if (found) {
                karmaConf.browsers.push(found);
            }
        });
    }

    if (options.watch) {
        karmaConf.singleRun = false;
        envUtil.set("transpileContinueOnError", true);

        gulp.watch(path.join(
            uniteConfig.dirs.www.unitTestSrc,
            `**/*.${uc.extensionMap(uniteConfig.sourceExtensions)}`
        ), ["unit-transpile"]);

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

    return new Promise((resolve) => {
        const server = new karma.Server(karmaConf, (exitCode) => {
            if (exitCode === 0) {
                resolve();
            } else {
                display.error(`Karma exited with code ${exitCode}`);
                process.exit(exitCode);
            }
        });

        server.start();
    });
});
/* Generated by UniteJS */
