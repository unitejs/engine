/**
 * Gulp tasks for cordova platform.
 */
import * as display from "./util/display";
import * as uc from "./util/unite-config";
import * as packageConfig from "./util/package-config";
import * as themeUtils from "./util/theme-utils";
import * as gulp from "gulp";
import * as runSequence from "run-sequence";
import * as path from "path";
import * as util from "util";
import * as fs from "fs";
import * as del from "del";
import * as asyncUtil from "./util/async-util";
import * as exec from "./util/exec";
import * as xml2js from "xml2js";
import * as minimist from "minimist";
import * as platformUtils from "./util/platform-utils";

function loadOptions (uniteConfig) {
    const platformSettings = platformUtils.getConfig(uniteConfig, "Cordova");

    let existingPlatforms = "windows,ios,android";
    if (platformSettings.platforms) {
        existingPlatforms = platformSettings.platforms.join(",");
    }

    const knownOptions = {
        "default": {
            "platforms": existingPlatforms,
            "save": false
        },
        "string": [
            "platforms"
        ],
        "boolean": [
            "save"
        ]
    };

    return minimist(process.argv.slice(2), knownOptions);
}

function execCordova (args, cwd) {
    const winExt = (/^win/).test(process.platform) ? ".cmd" : "";
    return exec.launch(`cordova${winExt}`, args, cwd);
}

function addPreference (xml, name, value) {
    const idx = xml.widget.preference
        .findIndex(pref => pref.$.name === name);
    if (idx < 0) {
        const pref = {"$": {}};
        pref.$.name = name;
        pref.$.value = value;
        xml.widget.preference.push(pref);
    } else {
        xml.widget.preference[idx].$.value = value;
    }
}

function getProjectName (uniteThemeConfig) {
    return uniteThemeConfig.title.replace(/ /g, "");
}

function getImageResources () {
    const images = {};
    images.android = [
        // Icons
        {"name": "icon.png", "size": 96},
        {"name": "icon-ldpi.png", "size": 36, "density": "ldpi"},
        {"name": "icon-mdpi.png", "size": 48, "density": "mdpi"},
        {"name": "icon-hdpi.png", "size": 72, "density": "hdpi"},
        {"name": "icon-xhdpi.png", "size": 96, "density": "xhdpi"},
        {"name": "icon-xxhdpi.png", "size": 144, "density": "xxhdpi"},
        {"name": "icon-xxxhdpi.png", "size": 192, "density": "xxxhdpi"},
        // Splash
        {"name": "screen-land-ldpi.png", "width": 320, "height": 200, "density": "land-ldpi"},
        {"name": "screen-land-mdpi.png", "width": 480, "height": 320, "density": "land-mdpi"},
        {"name": "screen-land-hdpi.png", "width": 800, "height": 480, "density": "land-hdpi"},
        {"name": "screen-land-xhdpi.png", "width": 1280, "height": 720, "density": "land-xhdpi"},
        {"name": "screen-land-xxhdpi.png", "width": 1600, "height": 960, "density": "land-xxhdpi"},
        {"name": "screen-land-xxxhdpi.png", "width": 1920, "height": 1280, "density": "land-xxxhdpi"},
        {"name": "screen-port-ldpi.png", "width": 200, "height": 320, "density": "port-ldpi"},
        {"name": "screen-port-mdpi.png", "width": 320, "height": 480, "density": "port-mdpi"},
        {"name": "screen-port-hdpi.png", "width": 480, "height": 800, "density": "port-hdpi"},
        {"name": "screen-port-xhdpi.png", "width": 720, "height": 1280, "density": "port-xhdpi"},
        {"name": "screen-port-xxhdpi.png", "width": 960, "height": 1600, "density": "port-xxhdpi"},
        {"name": "screen-port-xxxhdpi.png", "width": 1280, "height": 1920, "density": "port-xxxhdpi"}
    ];

    images.ios = [
        // Icons
        {"name": "icon-20.png", "size": 20},
        {"name": "icon-20@2x.png", "size": 40},
        {"name": "icon-20@3x.png", "size": 60},
        {"name": "icon-40.png", "size": 40},
        {"name": "icon-40@2x.png", "size": 80},
        {"name": "icon-50.png", "size": 50},
        {"name": "icon-50@2x.png", "size": 100},
        {"name": "icon-60@2x.png", "size": 120},
        {"name": "icon-60@3x.png", "size": 180},
        {"name": "icon-72.png", "size": 72},
        {"name": "icon-72@2x.png", "size": 144},
        {"name": "icon-76.png", "size": 76},
        {"name": "icon-76@2x.png", "size": 152},
        {"name": "icon-83.5@2x.png", "size": 167},
        {"name": "icon-1024.png", "size": 1024},
        {"name": "icon-small.png", "size": 29},
        {"name": "icon-small@2x.png", "size": 58},
        {"name": "icon-small@3x.png", "size": 87},
        {"name": "icon.png", "size": 57},
        {"name": "icon@2x.png", "size": 114},
        {"name": "AppIcon24x24@2x.png", "size": 48},
        {"name": "AppIcon27.5x27.5@2x.png", "size": 55},
        {"name": "AppIcon29x29@2x.png", "size": 58},
        {"name": "AppIcon29x29@3x.png", "size": 87},
        {"name": "AppIcon40x40@2x.png", "size": 80},
        {"name": "AppIcon44x44@2x.png", "size": 88},
        {"name": "AppIcon86x86@2x.png", "size": 172},
        {"name": "AppIcon98x98@2x.png", "size": 196},
        // Splash
        {"name": "Default~iphone.png", "width": 320, "height": 480},
        {"name": "Default@2x~iphone.png", "width": 640, "height": 960},
        {"name": "Default-Portrait~ipad.png", "width": 768, "height": 1024},
        {"name": "Default-Portrait@2x~ipad.png", "width": 1536, "height": 2048},
        {"name": "Default-Landscape~ipad.png", "width": 1024, "height": 768},
        {"name": "Default-Landscape@2x~ipad.png", "width": 2048, "height": 1536},
        {"name": "Default-568h@2x~iphone.png", "width": 640, "height": 1136},
        {"name": "Default-667h.png", "width": 750, "height": 1334},
        {"name": "Default-736h.png", "width": 1242, "height": 2208},
        {"name": "Default-Landscape-736h.png", "width": 2208, "height": 1242},
        {"name": "Default-2436h.png", "width": 1125, "height": 2436},
        {"name": "Default-Landscape-2436h.png", "width": 2436, "height": 1125}
    ];

    images.windows = [
        // Icons
        {"name": "StoreLogo.scale-100.png", "size": 50},
        {"name": "StoreLogo.scale-125.png", "size": 63},
        {"name": "StoreLogo.scale-140.png", "size": 70},
        {"name": "StoreLogo.scale-150.png", "size": 75},
        {"name": "StoreLogo.scale-180.png", "size": 90},
        {"name": "StoreLogo.scale-200.png", "size": 100},
        {"name": "StoreLogo.scale-240.png", "size": 120},
        {"name": "StoreLogo.scale-400.png", "size": 200},

        {"name": "Square44x44Logo.scale-100.png", "size": 44},
        {"name": "Square44x44Logo.scale-125.png", "size": 55},
        {"name": "Square44x44Logo.scale-140.png", "size": 62},
        {"name": "Square44x44Logo.scale-150.png", "size": 66},
        {"name": "Square44x44Logo.scale-200.png", "size": 88},
        {"name": "Square44x44Logo.scale-240.png", "size": 106},
        {"name": "Square44x44Logo.scale-400.png", "size": 176},

        {"name": "Square30x30Logo.scale-100.png", "size": 30},
        {"name": "Square70x70Logo.scale-100.png", "size": 70},

        {"name": "Square71x71Logo.scale-100.png", "size": 71},
        {"name": "Square71x71Logo.scale-125.png", "size": 89},
        {"name": "Square71x71Logo.scale-140.png", "size": 99},
        {"name": "Square71x71Logo.scale-150.png", "size": 107},
        {"name": "Square71x71Logo.scale-200.png", "size": 142},
        {"name": "Square71x71Logo.scale-240.png", "size": 170},
        {"name": "Square71x71Logo.scale-400.png", "size": 284},

        {"name": "Square150x150Logo.scale-100.png", "size": 150},
        {"name": "Square150x150Logo.scale-125.png", "size": 188},
        {"name": "Square150x150Logo.scale-140.png", "size": 210},
        {"name": "Square150x150Logo.scale-150.png", "size": 225},
        {"name": "Square150x150Logo.scale-200.png", "size": 300},
        {"name": "Square150x150Logo.scale-240.png", "size": 360},
        {"name": "Square150x150Logo.scale-400.png", "size": 600},

        {"name": "Square310x310Logo.scale-100.png", "size": 310},
        {"name": "Square310x310Logo.scale-125.png", "size": 388},
        {"name": "Square310x310Logo.scale-140.png", "size": 434},
        {"name": "Square310x310Logo.scale-150.png", "size": 465},
        {"name": "Square310x310Logo.scale-180.png", "size": 558},
        {"name": "Square310x310Logo.scale-200.png", "size": 620},
        {"name": "Square310x310Logo.scale-400.png", "size": 1240},

        {"name": "Wide310x150Logo.scale-80.png", "width": 248, "height": 120},
        {"name": "Wide310x150Logo.scale-100.png", "width": 310, "height": 150},
        {"name": "Wide310x150Logo.scale-125.png", "width": 388, "height": 188},
        {"name": "Wide310x150Logo.scale-140.png", "width": 434, "height": 210},
        {"name": "Wide310x150Logo.scale-150.png", "width": 465, "height": 225},
        {"name": "Wide310x150Logo.scale-180.png", "width": 558, "height": 270},
        {"name": "Wide310x150Logo.scale-200.png", "width": 620, "height": 300},
        {"name": "Wide310x150Logo.scale-240.png", "width": 744, "height": 360},
        {"name": "Wide310x150Logo.scale-400.png", "width": 1240, "height": 600},
        // Splash
        {"name": "SplashScreen.scale-100.png", "width": 620, "height": 300},
        {"name": "SplashScreen.scale-125.png", "width": 775, "height": 375},
        {"name": "SplashScreen.scale-140.png", "width": 868, "height": 420},
        {"name": "SplashScreen.scale-150.png", "width": 930, "height": 450},
        {"name": "SplashScreen.scale-180.png", "width": 1116, "height": 540},
        {"name": "SplashScreen.scale-200.png", "width": 1240, "height": 600},
        {"name": "SplashScreen.scale-400.png", "width": 2480, "height": 1200},
        {"name": "SplashScreenPhone.scale-240.png", "width": 1152, "height": 1920},
        {"name": "SplashScreenPhone.scale-140.png", "width": 672, "height": 1120},
        {"name": "SplashScreenPhone.scale-100.png", "width": 480, "height": 800}
    ];

    return images;
}

gulp.task("platform-cordova-clean", async () => {
    const uniteConfig = await uc.getUniteConfig();

    const toClean = [
        path.join(
            "../",
            uniteConfig.dirs.platformRoot,
            "/cordova/www/**/*"
        )
    ];

    display.info("Cleaning", toClean);
    try {
        await del(toClean, {"force": true});
    } catch (err) {
        display.error(err);
        process.exit(1);
    }
});

gulp.task("platform-cordova-create", async () => {
    try {
        const uniteConfig = await uc.getUniteConfig();

        const cordovaFolder = path.join("../", uniteConfig.dirs.platformRoot, "cordova");

        const exists = await asyncUtil.directoryExists(cordovaFolder);
        if (!exists) {
            await execCordova(["create", "../platform/cordova", "cordova", " --no-telemetry"]);
        }
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("platform-cordova-update-config", async () => {
    try {
        const uniteConfig = await uc.getUniteConfig();
        const uniteThemeConfig = await uc.getUniteThemeConfig(uniteConfig);
        const packageJson = await packageConfig.getPackageJson();

        const cordovaFolder = path.join("../", uniteConfig.dirs.platformRoot, "cordova");

        const cordovaPackageJsonFile = path.join(cordovaFolder, "package.json");
        const cordovaPackageJson = await util.promisify(fs.readFile)(cordovaPackageJsonFile);

        const cordovaPackage = JSON.parse(cordovaPackageJson.toString());

        cordovaPackage.name = packageJson.name;
        cordovaPackage.displayName = uniteThemeConfig.title;
        cordovaPackage.version = packageJson.version;
        cordovaPackage.description = uniteThemeConfig.metaDescription;
        cordovaPackage.license = packageJson.license;
        cordovaPackage.author = uniteThemeConfig.metaAuthor;

        await util.promisify(fs.writeFile)(cordovaPackageJsonFile, JSON.stringify(cordovaPackage, undefined, "\t"));

        const cordovaConfigFile = path.join(cordovaFolder, "config.xml");
        const cordovaConfigXml = await util.promisify(fs.readFile)(cordovaConfigFile);
        const xml = await util.promisify(xml2js.parseString)(cordovaConfigXml);
        xml.widget.$.id = "";
        if (uniteThemeConfig.namespace && uniteThemeConfig.namespace.length > 0) {
            xml.widget.$.id = uniteThemeConfig.namespace
                .split(".")
                .reverse()
                .join(".");
        } else {
            xml.widget.$.id += "org.example";
        }
        xml.widget.$.id += `.${packageJson.name.replace(/[^a-zA-Z0-9]+/g, "")}`;
        xml.widget.$.version = packageJson.version;
        xml.widget.name = getProjectName(uniteThemeConfig);
        xml.widget.description = uniteThemeConfig.metaDescription;
        xml.widget.author = xml.widget.author || [];
        if (uniteThemeConfig.metaAuthor && uniteThemeConfig.metaAuthor.length > 0) {
            xml.widget.author[0] = xml.widget.author[0] || {};
            xml.widget.author[0]._ = uniteThemeConfig.metaAuthor;
            xml.widget.author[0].$ = xml.widget.author.$ || {};
            if (uniteThemeConfig.metaAuthorEmail && uniteThemeConfig.metaAuthorEmail.length > 0) {
                xml.widget.author[0].$.email = uniteThemeConfig.metaAuthorEmail;
            }
            if (uniteThemeConfig.metaAuthorWebSite && uniteThemeConfig.metaAuthorWebSite.length > 0) {
                xml.widget.author[0].$.href = uniteThemeConfig.metaAuthorWebSite;
            }
        }

        xml.widget.preference = xml.widget.preference || [];
        addPreference(xml, "windows-target-version", "10.0");
        if (uniteThemeConfig.backgroundColor && uniteThemeConfig.backgroundColor.length > 0) {
            addPreference(xml, "SplashScreenBackgroundColor", uniteThemeConfig.backgroundColor);
        }

        const outXml = new xml2js.Builder().buildObject(xml);
        await util.promisify(fs.writeFile)(cordovaConfigFile, outXml);

        const cordovaJsProj = path.join(cordovaFolder, "cordova.jsproj");
        const projExists = await asyncUtil.fileExists(cordovaJsProj);
        if (!projExists) {
            const projContent = await util.promisify(fs.readFile)(path.join(
                uniteConfig.dirs.www.build,
                "/assets/platform/cordova/cordova.jsproj"
            ));

            await util.promisify(fs.writeFile)(cordovaJsProj, projContent);
        }
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("platform-cordova-create-platforms", async () => {
    try {
        const uniteConfig = await uc.getUniteConfig();

        const platformsFolder = path.join("../", uniteConfig.dirs.platformRoot, "cordova", "platforms");

        const platformsFile = path.join(platformsFolder, "platforms.json");
        const fileExists = await asyncUtil.fileExists(platformsFile);
        let currentPlatforms = {};
        if (fileExists) {
            currentPlatforms = JSON.parse(await util.promisify(fs.readFile)(platformsFile));
        }

        const cordovaFolder = path.join("../", uniteConfig.dirs.platformRoot, "cordova");
        const options = loadOptions(uniteConfig);
        const platformsToCreate = options.platforms.split(",");
        for (let i = 0; i < platformsToCreate.length; i++) {
            const args = [];
            if (currentPlatforms[platformsToCreate[i]]) {
                args.push("prepare");
                args.push(platformsToCreate[i]);
            } else {
                args.push("platform");
                args.push("add");
                args.push(platformsToCreate[i]);
                args.push("--save");
            }
            await execCordova(args, cordovaFolder);
        }

    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});


gulp.task("platform-cordova-gather", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);
    const uniteThemeConfig = await uc.getUniteThemeConfig(uniteConfig);
    const packageJson = await packageConfig.getPackageJson();

    const platformName = "Cordova";
    const gatherRoot = path.join("../", uniteConfig.dirs.platformRoot, platformName.toLowerCase(), "www");

    await platformUtils.gatherFiles(
        uniteConfig,
        buildConfiguration,
        packageJson,
        platformName,
        gatherRoot
    );

    const indexFilename = path.join(gatherRoot, "index.html");

    let indexContent = await util.promisify(fs.readFile)(indexFilename);

    const headTag = "</head>";
    indexContent = indexContent
        .toString()
        .replace(headTag, `${uniteThemeConfig.cordova.join("\n")}
        ${headTag}`);

    await util.promisify(fs.writeFile)(indexFilename, indexContent);
});

gulp.task("platform-cordova-dev", async () => {
    try {
        await util.promisify(runSequence)(
            "platform-cordova-clean",
            "platform-cordova-create",
            "platform-cordova-update-config",
            "platform-cordova-gather",
            "platform-cordova-create-platforms",
            "platform-cordova-save"
        );
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("platform-cordova-save", async () => {
    const knownOptions = {
        "default": {
            "platforms": undefined,
            "save": false
        },
        "string": [
            "platforms"
        ],
        "boolean": [
            "save"
        ]
    };

    const options = minimist(process.argv.slice(2), knownOptions);

    try {
        if (options.save) {
            display.info("Saving Options");

            const uniteConfig = await uc.getUniteConfig();
            uniteConfig.platforms.Cordova = uniteConfig.platforms.Cordova || {};
            if (options.platforms !== undefined) {
                if (options.platforms === "") {
                    delete uniteConfig.platforms.Cordova.platforms;
                } else {
                    uniteConfig.platforms.Cordova.platforms = options.platforms.split(",");
                }
            }
            await uc.setUniteConfig(uniteConfig);
        }
    } catch (err) {
        display.error("Saving options failed", err);
        process.exit(1);
    }
});

gulp.task("platform-cordova-theme", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const cordovaFolder = path.join("../", uniteConfig.dirs.platformRoot, "cordova");
    const resFolder = path.resolve(path.join(cordovaFolder, "res"));
    const uniteThemeConfig = await uc.getUniteThemeConfig(uniteConfig);

    const cordovaConfigFile = path.join(cordovaFolder, "config.xml");
    const cordovaConfigXml = await util.promisify(fs.readFile)(cordovaConfigFile);
    const xml = await util.promisify(xml2js.parseString)(cordovaConfigXml);
    xml.widget.platform = xml.widget.platform || [];

    const images = getImageResources();

    const options = loadOptions(uniteConfig);
    const platformsToCreate = options.platforms.split(",");
    for (let i = 0; i < platformsToCreate.length; i++) {
        const platform = platformsToCreate[i];

        let xmlPlatform = xml.widget.platform.find(p => p.$.name === platform);
        if (!xmlPlatform) {
            xmlPlatform = {};
            xmlPlatform.$ = {};
            xmlPlatform.$.name = platform;
            xml.widget.platform.push(xmlPlatform);
        }
        xmlPlatform.icon = [];
        xmlPlatform.splash = [];

        if (images[platform]) {
            await del(
                [
                    path.join(resFolder, "icon", platform),
                    path.join(resFolder, "screen", platform)
                ]
                , {"force": true}
            );

            for (let j = 0; j < images[platform].length; j++) {
                const img = images[platform][j];

                const iconOrScreen = img.size ? "icon" : "screen";

                const params = {
                    "command": "svgToPng",
                    "sourceFile": `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
                    "destFile": `${path.join(resFolder, iconOrScreen, platform, img.name)}`,
                    "background": uniteThemeConfig.backgroundColor
                };

                if (img.size) {
                    params.width = img.size;
                    params.height = img.size;
                    params.marginX = Math.round(img.size / 10);
                    params.marginY = Math.round(img.size / 10);
                } else {
                    params.width = img.width;
                    params.height = img.height;
                    if (params.width > params.height) {
                        params.marginX = Math.round((params.width - (params.height / 2)) / 2);
                        params.marginY = Math.round(params.height / 4);
                    } else {
                        params.marginX = Math.round(params.width / 4);
                        params.marginY = Math.round((params.height - (params.width / 2)) / 2);
                    }
                }

                await themeUtils.callUniteImage(params);

                const src = path.join("res", iconOrScreen, platform, img.name)
                    .replace(/\\/g, "/");
                const newImage = {};
                if (img.size) {
                    xmlPlatform.icon.push(newImage);
                } else {
                    xmlPlatform.splash.push(newImage);
                }

                newImage.$ = {};
                newImage.$.src = src;
                if (platform === "windows") {
                    newImage.$.target = img.name.split(".")[0];
                } else if (img.density) {
                    newImage.$.density = img.density;
                } else {
                    newImage.$.width = img.size ? img.size : img.width;
                    newImage.$.height = img.size ? img.size : img.height;
                }
            }
        }

        const outXml = new xml2js.Builder().buildObject(xml);
        await util.promisify(fs.writeFile)(cordovaConfigFile, outXml);
    }
});

// Generated by UniteJS
