/**
 * Gulp tasks for cordova platform.
 */
const display = require("./util/display");
const uc = require("./util/unite-config");
const packageConfig = require("./util/package-config");
const themeUtils = require("./util/theme-utils");
const gulp = require("gulp");
const runSequence = require("run-sequence");
const path = require("path");
const util = require("util");
const fs = require("fs");
const del = require("del");
const asyncUtil = require("./util/async-util");
const exec = require("./util/exec");
const xml2js = require("xml2js");
const minimist = require("minimist");
const platformUtils = require("./util/platform-utils");

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

        const platformFolder = path.join("../", uniteConfig.dirs.platformRoot, "cordova");

        const exists = await asyncUtil.directoryExists(platformFolder);
        if (!exists) {
            await execCordova(["create", "../platform/cordova", "cordova"]);
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

        const platformFolder = path.join("../", uniteConfig.dirs.platformRoot, "cordova");

        const cordovaPackageJsonFile = path.join(platformFolder, "package.json");
        const cordovaPackageJson = await util.promisify(fs.readFile)(cordovaPackageJsonFile);

        const cordovaPackage = JSON.parse(cordovaPackageJson.toString());

        cordovaPackage.name = packageJson.name;
        cordovaPackage.displayName = uniteConfig.title;
        cordovaPackage.version = packageJson.version;
        cordovaPackage.description = uniteThemeConfig.metaDescription;
        cordovaPackage.license = packageJson.license;
        cordovaPackage.author = uniteThemeConfig.metaAuthor;

        await util.promisify(fs.writeFile)(cordovaPackageJsonFile, JSON.stringify(cordovaPackage, undefined, "\t"));

        const cordovaConfigFile = path.join(platformFolder, "config.xml");
        const cordovaConfigXml = await util.promisify(fs.readFile)(cordovaConfigFile);
        const xml = await util.promisify(xml2js.parseString)(cordovaConfigXml);
        if (uniteThemeConfig.metaNamespace) {
            xml.widget.$.id = `${uniteThemeConfig.metaNamespace
                .split(".")
                .reverse()
                .join(".")}.${packageJson.name}`;
        } else {
            xml.widget.$.id = packageJson.name;
        }
        xml.widget.$.version = packageJson.version;
        xml.widget.name = uniteConfig.title.replace(/ /g, "-");
        xml.widget.description = uniteThemeConfig.metaDescription;
        xml.widget.author = xml.widget.author || [];
        xml.widget.author[0] = xml.widget.author[0] || {};
        xml.widget.author[0]._ = uniteThemeConfig.metaAuthor;
        xml.widget.author[0].$ = xml.widget.author.$ || {};
        xml.widget.author[0].$.email = uniteThemeConfig.metaAuthorEmail;
        xml.widget.author[0].$.href = uniteThemeConfig.metaAuthorWebSite;

        xml.widget.preference = xml.widget.preference || [];
        const winTargetIndex = xml.widget.preference.findIndex(pref => pref.$.name === "windows-target-version");
        if (winTargetIndex < 0) {
            const pref = {"$": {}};
            pref.$.name = "windows-target-version";
            pref.$.value = "10.0";
            xml.widget.preference.push(pref);
        }
        const splashBackgroundIndex = xml.widget.preference
            .findIndex(pref => pref.$.name === "SplashScreenBackgroundColor");
        if (splashBackgroundIndex < 0) {
            const pref = {"$": {}};
            pref.$.name = "SplashScreenBackgroundColor";
            pref.$.value = uniteThemeConfig.backgroundColor;
            xml.widget.preference.push(pref);
        }

        const outXml = new xml2js.Builder().buildObject(xml);
        await util.promisify(fs.writeFile)(cordovaConfigFile, outXml);

        await del(path.join(platformFolder, "res"), {"force": true});
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

    const platformFolder = path.join("../", uniteConfig.dirs.platformRoot, "cordova", "www");

    await platformUtils.gatherFiles(
        uniteConfig,
        buildConfiguration,
        packageJson,
        "Cordova",
        undefined,
        platformFolder
    );

    const indexFilename = path.join(platformFolder, "index.html");

    let indexContent = await util.promisify(fs.readFile)(indexFilename);

    const headTag = "</head>";
    indexContent = indexContent
        .toString()
        .replace(headTag, `${uniteThemeConfig.cordova.headers.join("\n")}
        ${headTag}`);

    indexContent = indexContent
        .replace(/<script>([\s\S]*?)<\/script>/g, `${uniteThemeConfig.cordova.scriptInclude.join("\n")}
        <script>
        ${uniteThemeConfig.cordova.scriptStart.join("\n")}
        $1
        ${uniteThemeConfig.cordova.scriptEnd.join("\n")}
        </script>`);

    await util.promisify(fs.writeFile)(indexFilename, indexContent);
});

gulp.task("platform-cordova-configure", async () => {
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
    const platformFolder = path.resolve(path.join("../", uniteConfig.dirs.platformRoot, "cordova", "platforms"));
    const uniteThemeConfig = await uc.getUniteThemeConfig(uniteConfig);

    const projectName = uniteConfig.title.replace(/ /g, "-");

    const roots = {};
    const images = {};

    roots.android = "res";
    images.android = [
        // Icons
        {"name": "drawable/icon.png", "size": 96},
        {"name": "drawable-hdpi/icon.png", "size": 72},
        {"name": "drawable-ldpi/icon.png", "size": 36},
        {"name": "drawable-mdpi/icon.png", "size": 48},
        {"name": "drawable-xhdpi/icon.png", "size": 96},
        {"name": "drawable-xxhdpi/icon.png", "size": 144},
        {"name": "drawable-xxxhdpi/icon.png", "size": 192},
        {"name": "mipmap-hdpi/icon.png", "size": 72},
        {"name": "mipmap-ldpi/icon.png", "size": 36},
        {"name": "mipmap-mdpi/icon.png", "size": 48},
        {"name": "mipmap-xhdpi/icon.png", "size": 96},
        {"name": "mipmap-xxhdpi/icon.png", "size": 144},
        {"name": "mipmap-xxxhdpi/icon.png", "size": 192},
        // Landscape
        {"name": "drawable-land-ldpi/screen.png", "width": 320, "height": 200},
        {"name": "drawable-land-mdpi/screen.png", "width": 480, "height": 320},
        {"name": "drawable-land-hdpi/screen.png", "width": 800, "height": 480},
        {"name": "drawable-land-xhdpi/screen.png", "width": 1280, "height": 720},
        {"name": "drawable-land-xxhdpi/screen.png", "width": 1600, "height": 960},
        {"name": "drawable-land-xxxhdpi/screen.png", "width": 1920, "height": 1280},
        // Portrait
        {"name": "drawable-port-ldpi/screen.png", "width": 200, "height": 320},
        {"name": "drawable-port-mdpi/screen.png", "width": 320, "height": 480},
        {"name": "drawable-port-hdpi/screen.png", "width": 480, "height": 800},
        {"name": "drawable-port-xhdpi/screen.png", "width": 720, "height": 1280},
        {"name": "drawable-port-xxhdpi/screen.png", "width": 960, "height": 1600},
        {"name": "drawable-port-xxxhdpi/screen.png", "width": 1280, "height": 1920}
    ];

    roots.ios = `${projectName}/Images.xcassets`;
    images.ios = [
        // Icons
        {"name": "AppIcon.appiconset/icon-20.png", "size": 20},
        {"name": "AppIcon.appiconset/icon-20@2x.png", "size": 40},
        {"name": "AppIcon.appiconset/icon-20@3x.png", "size": 60},
        {"name": "AppIcon.appiconset/icon-40.png", "size": 40},
        {"name": "AppIcon.appiconset/icon-40@2x.png", "size": 80},
        {"name": "AppIcon.appiconset/icon-50.png", "size": 50},
        {"name": "AppIcon.appiconset/icon-50@2x.png", "size": 100},
        {"name": "AppIcon.appiconset/icon-60@2x.png", "size": 120},
        {"name": "AppIcon.appiconset/icon-60@3x.png", "size": 180},
        {"name": "AppIcon.appiconset/icon-72.png", "size": 72},
        {"name": "AppIcon.appiconset/icon-72@2x.png", "size": 144},
        {"name": "AppIcon.appiconset/icon-76.png", "size": 76},
        {"name": "AppIcon.appiconset/icon-76@2x.png", "size": 152},
        {"name": "AppIcon.appiconset/icon-83.5@2x.png", "size": 167},
        {"name": "AppIcon.appiconset/icon-1024.png", "size": 1024},
        {"name": "AppIcon.appiconset/icon-small.png", "size": 29},
        {"name": "AppIcon.appiconset/icon-small@2x.png", "size": 58},
        {"name": "AppIcon.appiconset/icon-small@3x.png", "size": 87},
        {"name": "AppIcon.appiconset/icon.png", "size": 57},
        {"name": "AppIcon.appiconset/icon@2x.png", "size": 114},
        {"name": "AppIcon.appiconset/AppIcon24x24@2x.png", "size": 48},
        {"name": "AppIcon.appiconset/AppIcon27.5x27.5@2x.png", "size": 55},
        {"name": "AppIcon.appiconset/AppIcon29x29@2x.png", "size": 58},
        {"name": "AppIcon.appiconset/AppIcon29x29@3x.png", "size": 87},
        {"name": "AppIcon.appiconset/AppIcon40x40@2x.png", "size": 80},
        {"name": "AppIcon.appiconset/AppIcon44x44@2x.png", "size": 88},
        {"name": "AppIcon.appiconset/AppIcon86x86@2x.png", "size": 172},
        {"name": "AppIcon.appiconset/AppIcon98x98@2x.png", "size": 196},
        // IPhone
        {"name": "LaunchImage.launchimage/Default~iphone.png", "width": 320, "height": 480},
        {"name": "LaunchImage.launchimage/Default@2x~iphone.png", "width": 640, "height": 960},
        {"name": "LaunchImage.launchimage/Default-568h@2x~iphone.png", "width": 640, "height": 1136},
        {"name": "LaunchImage.launchimage/Default-667h.png", "width": 750, "height": 1334},
        {"name": "LaunchImage.launchimage/Default-736h.png", "width": 1242, "height": 2208},
        {"name": "LaunchImage.launchimage/Default-Landscape-736h.png", "width": 2208, "height": 1242},
        {"name": "LaunchImage.launchimage/Default-2436h.png", "width": 1125, "height": 2436},
        {"name": "LaunchImage.launchimage/Default-Landscape-2436h.png", "width": 2436, "height": 1125},
        // IPad
        {"name": "LaunchImage.launchimage/Default-Portrait~ipad.png", "width": 768, "height": 1024},
        {"name": "LaunchImage.launchimage/Default-Portrait@2x~ipad.png", "width": 1536, "height": 2048},
        {"name": "LaunchImage.launchimage/Default-Landscape~ipad.png", "width": 1024, "height": 768},
        {"name": "LaunchImage.launchimage/Default-Landscape@2x~ipad.png", "width": 2048, "height": 1536}
    ];

    roots.windows = "images";
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
        // Landscape
        {"name": "SplashScreen.scale-100.png", "width": 620, "height": 300},
        {"name": "SplashScreen.scale-125.png", "width": 775, "height": 375},
        {"name": "SplashScreen.scale-140.png", "width": 868, "height": 420},
        {"name": "SplashScreen.scale-150.png", "width": 930, "height": 450},
        {"name": "SplashScreen.scale-180.png", "width": 1116, "height": 540},
        {"name": "SplashScreen.scale-200.png", "width": 1240, "height": 600},
        {"name": "SplashScreen.scale-400.png", "width": 2480, "height": 1200},
        // Portrait
        {"name": "SplashScreenPhone.scale-240.png", "width": 1152, "height": 1920},
        {"name": "SplashScreenPhone.scale-140.png", "width": 672, "height": 1120},
        {"name": "SplashScreenPhone.scale-100.png", "width": 480, "height": 800}
    ];

    const options = loadOptions(uniteConfig);
    const platformsToCreate = options.platforms.split(",");
    for (let i = 0; i < platformsToCreate.length; i++) {
        const platform = platformsToCreate[i];
        if (images[platform] && roots[platform]) {
            for (let j = 0; j < images[platform].length; j++) {
                const params = {
                    "command": "svgToPng",
                    "sourceFile": `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
                    "destFile": `${path.join(platformFolder, platform, roots[platform], images[platform][j].name)}`,
                    "background": uniteThemeConfig.backgroundColor
                };

                if (images[platform][j].size) {
                    params.width = images[platform][j].size;
                    params.height = images[platform][j].size;
                    params.marginX = Math.round(images[platform][j].size / 10);
                    params.marginY = Math.round(images[platform][j].size / 10);
                } else {
                    params.width = images[platform][j].width;
                    params.height = images[platform][j].height;
                    if (params.width > params.height) {
                        params.marginX = Math.round((params.width - (params.height / 2)) / 2);
                        params.marginY = Math.round(params.height / 4);
                    } else {
                        params.marginX = Math.round(params.width / 4);
                        params.marginY = Math.round((params.height - (params.width / 2)) / 2);
                    }
                }

                await themeUtils.callUniteImage(params);
            }
        }
    }
});

/* Generated by UniteJS */
