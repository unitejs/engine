/**
 * Gulp tasks for docker platform.
 */
const display = require("./util/display");
const uc = require("./util/unite-config");
const gulp = require("gulp");
const runSequence = require("run-sequence");
const util = require("util");
const path = require("path");
const del = require("del");
const fs = require("fs");
const asyncUtil = require("./util/async-util");
const packageConfig = require("./util/package-config");
const platformUtils = require("./util/platform-utils");
const minimist = require("minimist");
const exec = require("./util/exec");

function loadOptions (uniteConfig) {
    const platformSettings = platformUtils.getConfig(uniteConfig, "Docker");

    const knownOptions = {
        "default": {
            "image": platformSettings.image || "nginx",
            "www": platformSettings.www || "/usr/share/nginx/html",
            "save": false
        },
        "string": [
            "image",
            "www"
        ],
        "boolean": [
            "save"
        ]
    };

    return minimist(process.argv.slice(2), knownOptions);
}

gulp.task("platform-docker-package", async () => {
    try {
        await util.promisify(runSequence)(
            "platform-docker-clean",
            "platform-docker-gather",
            "platform-docker-build-image",
            "platform-docker-save"
        );
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("platform-docker-clean", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const packageJson = await packageConfig.getPackageJson();

    const options = loadOptions(uniteConfig);

    const toClean = [
        path.join("../", uniteConfig.dirs.packagedRoot, `/${packageJson.version}/docker_${options.image}/**/*`),
        path.join("../", uniteConfig.dirs.packagedRoot, `/${packageJson.version}_docker_${options.image}.tar`)
    ];
    display.info("Cleaning", toClean);
    return del(toClean, {"force": true});
});

gulp.task("platform-docker-gather", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);
    const packageJson = await packageConfig.getPackageJson();

    const options = loadOptions(uniteConfig);

    const platformName = `docker_${options.image}`;
    const gatherRoot = path.join(
        "../",
        uniteConfig.dirs.packagedRoot,
        `/${packageJson.version}/${platformName.toLowerCase()}/`,
        options.www
    );

    await platformUtils.gatherFiles(
        uniteConfig,
        buildConfiguration,
        packageJson,
        platformName,
        gatherRoot
    );

    display.info("Copying Image Additions");

    return asyncUtil.stream(gulp.src(path.join(
        uniteConfig.dirs.www.assetsSrc,
        `docker/${options.image}/**/*`
    ), {"dot": true})
        .pipe(gulp.dest(gatherRoot)));
});

gulp.task("platform-docker-build-image", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const packageJson = await packageConfig.getPackageJson();

    const options = loadOptions(uniteConfig);

    display.info("Writing Dockerfile");

    const platformRoot = path.resolve(path.join(
        "../",
        uniteConfig.dirs.packagedRoot,
        `/${packageJson.version}/`
    ));

    const dockerFilename = path.join(platformRoot, "dockerfile");

    try {
        const dockerFile = `FROM ${options.image}\nCOPY docker_${options.image} /`;

        await util.promisify(fs.writeFile)(dockerFilename, dockerFile);
    } catch (err) {
        display.error("Creating dockerfile failed", err);
        process.exit(1);
    }

    display.info("Building Image", "Docker");

    const tagName = `${packageJson.name}:v${packageJson.version}`;

    try {
        await exec.launch("docker", [
            "build",
            ".",
            "--file=dockerfile",
            "--pull",
            `--tag=${tagName}`
        ], platformRoot);
    } catch (err) {
        display.error("Building docker image failed", err);
        process.exit(1);
    }

    try {
        const dockerArchive = path.resolve(path.join(
            "../",
            uniteConfig.dirs.packagedRoot
        ));

        await exec.launch("docker", [
            "save",
            `--output=${packageJson.version}_docker_${options.image}.tar`,
            tagName
        ], dockerArchive);
    } catch (err) {
        display.error("Saving docker image failed", err);
        process.exit(1);
    }

    return del([dockerFilename], {"force": true});
});

gulp.task("platform-docker-save", async () => {
    const uniteConfig = await uc.getUniteConfig();

    const knownOptions = {
        "default": {
            "image": undefined,
            "www": undefined,
            "save": false
        },
        "string": [
            "image",
            "www"
        ],
        "boolean": [
            "save"
        ]
    };

    const options = minimist(process.argv.slice(2), knownOptions);

    try {
        if (options.save) {
            display.info("Saving Options");

            uniteConfig.platforms.Docker = uniteConfig.platforms.Docker || {};
            if (options.image !== undefined) {
                if (options.image === "") {
                    delete uniteConfig.platforms.Docker.image;
                } else {
                    uniteConfig.platforms.Docker.image = options.image;
                }
            }
            if (options.www !== undefined) {
                if (options.www === "") {
                    delete uniteConfig.platforms.Docker.www;
                } else {
                    uniteConfig.platforms.Docker.www = options.www;
                }
            }

            await uc.setUniteConfig(uniteConfig);
        }
    } catch (err) {
        display.error("Saving options failed", err);
        process.exit(1);
    }
});

/* Generated by UniteJS */
