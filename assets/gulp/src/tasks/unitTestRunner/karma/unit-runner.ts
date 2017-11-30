/**
 * Gulp tasks for karma unit testing.
 */
import * as fs from "fs";
import * as gulp from "gulp";
import * as karma from "karma";
import * as minimist from "minimist";
import * as path from "path";
import * as runSequence from "run-sequence";
import * as util from "util";
import { IKarmaFile } from "../../../types/IKarmaFile";
import { IUniteConfiguration } from "../../../types/IUniteConfiguration";
import * as clientPackages from "../../util/client-packages";
import * as display from "../../util/display";
import * as envUtil from "../../util/env-util";
import * as jsonHelper from "../../util/json-helper";
import * as uc from "../../util/unite-config";

function addClientPackageTestFiles(uniteConfig: IUniteConfiguration, files: IKarmaFile[]): IKarmaFile[] {
    let newFiles: IKarmaFile[] = [];
    const newModuleLoaders: IKarmaFile[] = [];

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

        const pkgFiles = clientPackages.getPackageFiles(uniteConfig, pkg, false);
        pkgFiles.forEach(pkgFile => {
            addArray.push({
                pattern: pkgFile,
                included: pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both",
                includeType
            });
        });

        const pkgTestingAdditions = clientPackages.getPackageTestingAdditions(uniteConfig, pkg);
        pkgTestingAdditions.forEach(pkgTestingAddition => {
            addArray.push({
                pattern: pkgTestingAddition,
                included: pkg.scriptIncludeMode === "notBundled" || pkg.scriptIncludeMode === "both",
                includeType
            });
        });

        const pkgAssets = clientPackages.getPackageAssets(uniteConfig, pkg);
        pkgAssets.forEach((pkgAsset) => {
            addArray.push({
                pattern: pkgAsset,
                included: false,
                includeType: "asset"
            });
        });
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

    const knownOptions: { default: { [id: string]: any }; string: string[]; boolean: string[] } = {
        default: {
            grep: "!(*-bundle|app-module-config|entryPoint)",
            browser: undefined,
            watch: false
        },
        string: [
            "grep",
            "browser"
        ],
        boolean: [
            "watch"
        ]
    };

    const options = minimist<{ grep: string; browser: string; watch: boolean }>(process.argv.slice(2), knownOptions);

    const uniteConfig = await uc.getUniteConfig();

    try {
        const confBuffer = await util.promisify(fs.readFile)("./karma.conf.js");
        let conf = confBuffer.toString();
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

    const karmaConf: karma.ConfigOptions & karma.ConfigFile &
        { coverageReporter?: { include: string } } &
        { customLaunchers: { [id: string]: any } } = {
        configFile: "../../../karma.conf.js",
        coverageReporter: {
            include: `${uniteConfig.dirs.www.dist}**/${options.grep}.js`
        },
        customLaunchers: {}
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
                karmaConf.browsers.push(found === "ChromeHeadless" ? "ChromeHeadlessNoSandbox" : found);
            }
        });
    }

    karmaConf.customLaunchers = {
        ChromeHeadlessNoSandbox: {
            base: "ChromeHeadless",
            flags: ["--no-sandbox"]
        }
    };

    if (options.watch) {
        karmaConf.singleRun = false;
        envUtil.set("transpileContinueOnError", true);

        gulp.watch(path.join(
            uniteConfig.dirs.www.unitTestSrc,
            `**/*.${uc.extensionMap(uniteConfig.sourceExtensions)}`
        ),         () => runSequence("unit-transpile"));

        gulp.watch(
            path.join(uniteConfig.dirs.www.src, `**/*.${uc.extensionMap(uniteConfig.sourceExtensions)}`),
            () => {
                require("./build");
                runSequence("build-src-all");
            }
        );
        gulp.watch(
            path.join(uniteConfig.dirs.www.src, `**/*.${uc.extensionMap(uniteConfig.viewExtensions)}`),
            () => {
                require("./build");
                runSequence("build-src-view-all");
            }
        );
        gulp.watch(
            path.join(uniteConfig.dirs.www.src, `**/*.${uniteConfig.styleExtension}`),
            () => {
                require("./build");
                runSequence("build-src-style-all");
            }
        );
        gulp.watch(
            path.join(uniteConfig.dirs.www.cssSrc, `**/*.${uniteConfig.styleExtension}`),
            () => {
                require("./build");
                runSequence("build-src-css-all");
            }
        );
    }

    return new Promise((resolve, reject) => {
        const server = new karma.Server(karmaConf, (exitCode) => {
            if (exitCode === 0) {
                resolve();
            } else {
                display.error(`Karma exited with code ${exitCode}`);
                process.exit(exitCode);
                reject();
            }
        });

        server.start();
    });
});
// Generated by UniteJS
