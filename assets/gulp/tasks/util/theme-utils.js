/**
 * Gulp utils for themes.
 */
const gulp = require("gulp");
const display = require("./display");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const fs = require("fs");
const path = require("path");
const os = require("os");
const exec = require("./exec");
const mkdirp = require("mkdirp");

function fileExists (filename, callback) {
    fs.stat(filename, (err, stat) => {
        if (err) {
            if (err.code === "ENOENT") {
                callback(false);
            } else {
                display.error(`Error accessing '${filename}`, err);
                process.exit(1);
            }
        } else if (stat.isFile()) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

function writeIndex (templateName, cacheBust, config, headers) {
    const formattedHeaders = headers.filter(header => header.trim().length > 0).join("\r\n        ");
    return gulp.src(templateName)
        .pipe(replace("{THEME}", `        ${formattedHeaders}`))
        .pipe(replace("{CACHEBUST}", cacheBust))
        .pipe(replace("{UNITECONFIG}", config))
        .pipe(rename("index.html"))
        .pipe(gulp.dest("./"));
}

function buildIndex (uniteConfig, uniteThemeConfig, buildConfiguration, packageJson) {
    const cacheBust = buildConfiguration.bundle ? `?v=${new Date().getTime()}` : "";

    const uniteJs = {
        "config": buildConfiguration.variables,
        "packageVersion": packageJson.version,
        "uniteVersion": uniteConfig.uniteVersion
    };

    const config = `window.unite = ${JSON.stringify(uniteJs)};`;

    let headers = [];

    if (uniteThemeConfig.metaDescription) {
        headers.push(`<meta name="description" content="${uniteThemeConfig.metaDescription}">`);
    }

    if (uniteThemeConfig.metaKeywords && uniteThemeConfig.metaKeywords.length > 0) {
        headers.push(`<meta name="keywords" content="${uniteThemeConfig.metaKeywords.join(",")}">`);
    }

    if (uniteThemeConfig.metaAuthor) {
        headers.push(`<meta name="author" content="${uniteThemeConfig.metaAuthor}">`);
    }

    if (uniteThemeConfig.themeHeaders && uniteThemeConfig.themeHeaders.length > 0) {
        headers = headers.concat(uniteThemeConfig.themeHeaders);
    }

    if (uniteThemeConfig.customHeaders && uniteThemeConfig.customHeaders.length > 0) {
        headers = headers.concat(uniteThemeConfig.customHeaders);
    }

    return writeIndex(buildConfiguration.bundle ? "./index-bundle.html" : "./index-no-bundle.html", cacheBust, config, headers);
}

function buildBrowserConfig (uniteConfig, uniteThemeConfig, callback) {
    const tileFilename = path.join(uniteConfig.directories.assets, "favicon/", "mstile-150x150.png");

    fileExists(tileFilename, (tileExists) => {
        if (tileExists) {
            const bcFilename = path.join(uniteConfig.directories.assets, "favicon/", "browserconfig.xml");
            const browserConfig = [
                "<?xml version=\"1.0\" encoding=\"utf-8\"?>",
                "<browserconfig>",
                "    <msapplication>",
                "        <tile>",
                "            <square150x150logo src=\"./assets/favicon/mstile-150x150.png\"/>"
            ];

            if (uniteThemeConfig.backgroundColor) {
                browserConfig.push(`            <TileColor>${uniteThemeConfig.backgroundColor}</TileColor>`);
            }
            browserConfig.push("        </tile>");
            browserConfig.push("    </msapplication>");
            browserConfig.push("</browserconfig>");

            fs.writeFile(bcFilename, browserConfig.join(os.EOL), (err2) => {
                if (err2) {
                    display.error(`Failed to write '${bcFilename}`, err2);
                    callback(false);
                } else {
                    callback(true);
                }
            });
        } else {
            display.info("Skipping Create as tile does not exist", tileFilename);
            callback(true);
        }
    });
}

function buildManifestJson (uniteConfig, uniteThemeConfig, callback) {
    const manifest = {
        "name": uniteConfig.title,
        "icons": [],
        "theme_color": uniteThemeConfig.themeColor,
        "background_color": uniteThemeConfig.backgroundColor,
        "display": "standalone"
    };

    const size = [192, 512];
    let imageCounter = 0;

    const doNext = () => {
        const fname = path.join(uniteConfig.directories.assets,
            "favicon/",
            `android-chrome-${size[imageCounter]}x${size[imageCounter]}.png`);
        fileExists(fname, (imageExists) => {
            if (imageExists) {
                manifest.icons.push({
                    "src": `./${fname.replace(/\\/g, "/")}`,
                    "sizes": `${size[imageCounter]}x${size[imageCounter]}`,
                    "type": "image/png"
                });
            }
            imageCounter++;
            if (imageCounter === size.length) {
                const manifestFilename = path.join(uniteConfig.directories.assets, "favicon/", "manifest.json");

                fs.writeFile(manifestFilename, JSON.stringify(manifest, undefined, "\t"), (err2) => {
                    if (err2) {
                        display.error(`Failed to write '${manifestFilename}`, err2);
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            } else {
                doNext();
            }
        });
    };

    doNext();
}

function buildThemeHeaders (uniteConfig, uniteThemeConfig, callback) {
    uniteThemeConfig.themeHeaders = [];

    const headers = [
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "apple-touch-icon.png"),
            "header": "<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"./assets/favicon/apple-touch-icon.png\">"
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "favicon-32x32.png"),
            "header": "<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"./assets/favicon/favicon-32x32.png\">"
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "favicon-16x16.png"),
            "header": "<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"./assets/favicon/favicon-16x16.png\">"
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "manifest.json"),
            "header": "<link rel=\"manifest\" href=\"./assets/favicon/manifest.json\">"
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "safari-pinned-tab.svg"),
            "header": `<link rel="mask-icon" href="./assets/favicon/safari-pinned-tab.svg" color="${uniteConfig.themeColor}">`
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "favicon.ico"),
            "header": "<link rel=\"shortcut icon\" href=\"./assets/favicon/favicon.ico\">"
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "browserconfig.xml"),
            "header": "<meta name=\"msapplication-config\" content=\"./assets/favicon/browserconfig.xml\">"
        }
    ];

    let counter = 0;

    const doNext = () => {
        fileExists(headers[counter].file, (headerFileExists) => {
            if (headerFileExists) {
                uniteThemeConfig.themeHeaders.push(headers[counter].header);
            }
            counter++;
            if (counter === headers.length) {
                if (uniteThemeConfig.themeColor) {
                    uniteThemeConfig.themeHeaders.push(`<meta name="theme-color" content="${uniteThemeConfig.themeColor}">`);
                }
                callback(true);
            } else {
                doNext();
            }
        });
    };

    doNext();
}

function callUniteImage (config, cb) {
    const params = [];

    params.push(config.command);

    for (const key in config) {
        params.push(`--${key}=${config[key]}`);
    }

    exec.npmRun("unite-image", params, (success) => {
        cb(success);
    });
}

function generateFavIcons (uniteConfig, uniteThemeConfig, favIconDirectory, cb) {
    const images = [
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "android-chrome-192x192.png")}`,
            "width": 192,
            "height": 192,
            "marginX": 19,
            "marginY": 19,
            "background": uniteThemeConfig.backgroundColor
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "android-chrome-512x512.png")}`,
            "width": 512,
            "height": 512,
            "marginX": 51,
            "marginY": 51,
            "background": uniteThemeConfig.backgroundColor
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "apple-touch-icon.png")}`,
            "width": 180,
            "height": 180,
            "marginX": 18,
            "marginY": 18,
            "background": uniteThemeConfig.backgroundColor
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "mstile-70x70.png")}`,
            "width": 128,
            "height": 128,
            "marginX": 12,
            "marginY": 12
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "mstile-144x144.png")}`,
            "width": 144,
            "height": 144,
            "marginX": 14,
            "marginY": 14
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "mstile-150x150.png")}`,
            "width": 270,
            "height": 270,
            "marginX": 67,
            "marginY": 67
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "mstile-310x150.png")}`,
            "width": 558,
            "height": 270,
            "marginX": 140,
            "marginY": 67
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "mstile-310x310.png")}`,
            "width": 558,
            "height": 558,
            "marginX": 140,
            "marginY": 140
        },
        {
            "command": "svgToMask",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "safari-pinned-tab.svg")}`
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-transparent.svg")}`,
            "destFile": `${path.join(favIconDirectory, "favicon-16x16.png")}`,
            "width": 16,
            "height": 16
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-transparent.svg")}`,
            "destFile": `${path.join(favIconDirectory, "favicon-32x32.png")}`,
            "width": 32,
            "height": 32
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-transparent.svg")}`,
            "destFile": `${path.join(favIconDirectory, "favicon-48x48.png")}`,
            "width": 48,
            "height": 48
        },
        {
            "command": "pngsToIco",
            "sourceFolder": favIconDirectory,
            "sourceFiles": "favicon-16x16.png,favicon-32x32.png,favicon-48x48.png",
            "destFile": `${path.join(favIconDirectory, "favicon.ico")}`
        }
    ];

    mkdirp(favIconDirectory, (err) => {
        if (err) {
            display.error(err);
            process.exit(1);
        } else {
            let imageCounter = 0;

            const doNext = () => {
                callUniteImage(images[imageCounter], (success) => {
                    if (success) {
                        imageCounter++;
                        if (imageCounter === images.length) {
                            cb(true);
                        } else {
                            doNext();
                        }
                    } else {
                        cb(false);
                    }
                });
            };

            doNext();
        }
    });
}

module.exports = {
    buildBrowserConfig,
    buildIndex,
    buildManifestJson,
    buildThemeHeaders,
    callUniteImage,
    generateFavIcons
};

/* Generated by UniteJS */
