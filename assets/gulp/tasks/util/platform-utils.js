/**
 * Gulp utilities for platform.
 */
const display = require("./display");
const gulp = require("gulp");
const path = require("path");
const clientPackages = require("./client-packages");
const asyncUtil = require("./async-util");
const themeUtils = require("./theme-utils");

async function listFiles (uniteConfig, buildConfiguration) {
    const bundleExists = await asyncUtil.fileExists(path.join(uniteConfig.dirs.www.dist, "app-bundle.js"));
    if (buildConfiguration.bundle && !bundleExists) {
        display.error(`You have specified configuration '${buildConfiguration.name}' which is bundled,` +
            " but the dist folder contains a non bundled build.");
        process.exit(1);
    } else if (!buildConfiguration.bundle && bundleExists) {
        display.error(`You have specified configuration '${buildConfiguration.name}' which is not bundled,` +
            " but the dist folder contains a bundled build.");
        process.exit(1);
    }

    let files = [
        {"src": path.join("./", "index.html")},
        {"src": path.join("./", "service-worker.js")},
        {"src": path.join(uniteConfig.dirs.www.dist, "**/*")},
        {"src": path.join(uniteConfig.dirs.www.cssDist, "**/*")},
        {"src": path.join(uniteConfig.dirs.www.assets, "**/*")},
        {"src": path.join(uniteConfig.dirs.www.assetsSrc, "root/**/*"), "moveToRoot": true}
    ];

    const packageFiles = clientPackages.getDistFiles(
        uniteConfig,
        ["app", "both"],
        buildConfiguration.bundle,
        buildConfiguration.minify
    );
    packageFiles.forEach((packageFile) => {
        files = files.concat({"src": packageFile});
    });

    files = files.concat(clientPackages.getAssets(uniteConfig).map(a => {
        return {"src": a};
    }));

    return files;
}

async function gatherFiles (uniteConfig, buildConfiguration, packageJson, platformName, wwwRootFolder) {
    display.info("Gathering Files", platformName);

    const files = await listFiles(uniteConfig, buildConfiguration);

    const platformRoot = path.join(
        "../",
        uniteConfig.dirs.packagedRoot,
        `/${packageJson.version}/${platformName.toLowerCase()}/`
    );

    const dest = wwwRootFolder ? path.join(platformRoot, wwwRootFolder) : platformRoot;
    display.info("Destination", dest);

    for (let i = 0; i < files.length; i++) {
        const fileDest = files[i].moveToRoot ? dest
            : path.join(
                dest,
                files[i].src.indexOf("**") > 0
                    ? files[i].src.replace(/\*\*[/\\]\*(.*)/, "") : path.dirname(files[i].src)
            );

        display.info("Copying Files", files[i].src);
        display.info("To", fileDest);

        await asyncUtil.stream(gulp.src(files[i].src, {"dot": true})
            .pipe(gulp.dest(fileDest)));
    }

    await themeUtils.buildPwa(uniteConfig, buildConfiguration, packageJson, files, dest, true);

    return platformRoot;
}

function getConfig (uniteConfig, platformName) {
    if (uniteConfig.platforms &&
        uniteConfig.platforms[platformName]) {
        return uniteConfig.platforms[platformName];
    } else {
        return {};
    }
}

module.exports = {
    gatherFiles,
    getConfig,
    listFiles
};


/* Generated by UniteJS */
