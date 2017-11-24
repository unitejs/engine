/**
 * Gulp utils for themes.
 */
import * as fs from "fs";
import * as glob from "glob";
import * as gulp from "gulp";
import * as rename from "gulp-rename";
import * as replace from "gulp-replace";
import * as mkdirp from "mkdirp";
import * as os from "os";
import * as path from "path";
import * as util from "util";
import { IManifest } from "../../types/IManifest";
import { IPackageJson } from "../../types/IPackageJson";
import { IUniteBuildConfiguration } from "../../types/IUniteBuildConfiguration";
import { IUniteConfiguration } from "../../types/IUniteConfiguration";
import { IUniteImageCliCommand } from "../../types/IUniteImageCliCommand";
import { IUniteThemeConfiguration } from "../../types/IUniteThemeConfiguration";
import * as asyncUtil from "./async-util";
import * as clientPackages from "./client-packages";
import * as configUtil from "./config-utils";
import * as display from "./display";
import * as exec from "./exec";

async function writeIndex(minify: boolean,
                          templateName: string,
                          title: string,
                          cacheBust: string,
                          config: string,
                          headers: string[],
                          scriptIncludes: string[],
                          appLoader: string[],
                          bodyEnd: string[]): Promise<void> {
    const join = minify ? "" : "\r\n        ";
    const formattedHeaders = headers
        .filter(header => header.trim().length > 0)
        .join(join);
    const formattedScriptIncludes = scriptIncludes
        .filter(scriptInclude => scriptInclude.trim().length > 0)
        .join(join);
    const formattedBodyEnd = bodyEnd
        .filter(be => be.trim().length > 0)
        .join(join);
    const formattedAppLoader = appLoader
        .filter(al => al.trim().length > 0)
        .join(join);
    return asyncUtil.stream(gulp.src(templateName)
        .pipe(replace("{THEME}", `        ${formattedHeaders}`))
        .pipe(replace("{SCRIPTINCLUDE}", `        ${formattedScriptIncludes}`))
        .pipe(replace("{TITLE}", title))
        .pipe(replace("{CACHEBUST}", cacheBust))
        .pipe(replace("{UNITECONFIG}", config))
        .pipe(replace("{APPLOADER}", formattedAppLoader))
        .pipe(replace("{BODYEND}", `        ${formattedBodyEnd}`))
        .pipe(rename("index.html"))
        .pipe(gulp.dest("./")));
}

export async function buildIndex(uniteConfig: IUniteConfiguration,
                                 uniteThemeConfig: IUniteThemeConfiguration,
                                 buildConfiguration: IUniteBuildConfiguration,
                                 packageJson: IPackageJson): Promise<void> {
    const cacheBust = buildConfiguration.bundle ? `?v=${new Date().getTime()}` : "";

    const uniteJs = await configUtil.create(uniteConfig, buildConfiguration, packageJson);

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

    headers.push("<link rel=\"manifest\" href=\"./assets/favicon/manifest.json\">");

    const substTheme = (line: string) =>
        line.replace("THEME_COLOR", uniteThemeConfig.themeColor)
            .replace("THEME_BACKGROUND_COLOR", uniteThemeConfig.backgroundColor);

    const loaderCssFilename = path.join(uniteConfig.dirs.www.assetsSrc, "theme", "loader.css");
    const cssExists = await asyncUtil.fileExists(loaderCssFilename);
    if (cssExists) {
        const loaderCss = await util.promisify(fs.readFile)(loaderCssFilename);
        const loaderCssLines = loaderCss.toString().split("\n");

        if (loaderCssLines && loaderCssLines.length > 0) {
            headers.push("<style>");
            headers = headers.concat(loaderCssLines.map(substTheme));
            headers.push("</style>");
        }
    }

    const loaderHtmlFilename = path.join(uniteConfig.dirs.www.assetsSrc, "theme", "loader.html");
    const htmlExists = await asyncUtil.fileExists(loaderHtmlFilename);
    let appLoader: string[] = [];
    if (htmlExists) {
        const loaderHtml = await util.promisify(fs.readFile)(loaderHtmlFilename);
        appLoader = loaderHtml.toString().split("\n").map(substTheme);
    }

    const scriptIncludes = clientPackages.getScriptIncludes(uniteConfig, buildConfiguration.bundle);
    const bodyEnd = [];

    if (uniteJs.config.googleAnalyticsId) {
        bodyEnd.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${uniteJs.config.googleAnalyticsId}"></script>`);
        bodyEnd.push("<script>");
        bodyEnd.push("window.dataLayer=window.dataLayer||[];");
        bodyEnd.push("function gtag(){dataLayer.push(arguments)};");
        bodyEnd.push("gtag('js',new Date());");
        bodyEnd.push(`gtag('config','${uniteJs.config.googleAnalyticsId}');`);
        bodyEnd.push("</script>");
    }

    return writeIndex(
        buildConfiguration.minify,
        buildConfiguration.bundle ? "./index-bundle.html" : "./index-no-bundle.html",
        uniteThemeConfig.title,
        cacheBust,
        config,
        headers,
        scriptIncludes.map(scriptInclude => `<script src="${scriptInclude}"></script>`),
        appLoader,
        bodyEnd
    );
}

export async function buildBrowserConfig(uniteConfig: IUniteConfiguration,
                                         uniteThemeConfig: IUniteThemeConfiguration): Promise<void> {
    const tileFilename = path.join(uniteConfig.dirs.www.assets, "favicon/", "mstile-150x150.png");

    const tileExists = await asyncUtil.fileExists(tileFilename);

    if (tileExists) {
        const bcFilename = path.join(uniteConfig.dirs.www.assets, "favicon/", "browserconfig.xml");
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

        try {
            await util.promisify(fs.writeFile)(bcFilename, browserConfig.join(os.EOL));
        } catch (err) {
            display.error(`Writing ${bcFilename}`, err);
            process.exit(1);
        }
    } else {
        display.info("Skipping Create as tile does not exist", tileFilename);
    }
}

export async function buildManifestJson(uniteConfig: IUniteConfiguration,
                                        uniteThemeConfig: IUniteThemeConfiguration,
                                        packageJson: IPackageJson): Promise<void> {
    const manifest: IManifest = {
        name: uniteThemeConfig.title,
        short_name: uniteThemeConfig.shortName || uniteThemeConfig.title,
        description: uniteThemeConfig.metaDescription || uniteThemeConfig.title,
        version: packageJson.version,
        author: uniteThemeConfig.metaAuthor,
        icons: [],
        theme_color: uniteThemeConfig.themeColor,
        background_color: uniteThemeConfig.backgroundColor,
        display: "standalone",
        start_url: "../../index.html"
    };

    const sizes = [192, 512];

    for (let i = 0; i < sizes.length; i++) {
        const fname = path.join(
            uniteConfig.dirs.www.assets,
            "favicon/",
            `android-chrome-${sizes[i]}x${sizes[i]}.png`
        );

        const imageExists = await asyncUtil.fileExists(fname);
        if (imageExists) {
            manifest.icons.push({
                src: `../../${fname.replace(/\\/g, "/")}`,
                sizes: `${sizes[i]}x${sizes[i]}`,
                type: "image/png"
            });
        }
    }

    const manifestFilename = path.join(uniteConfig.dirs.www.assets, "favicon/", "manifest.json");

    try {
        await util.promisify(fs.writeFile)(manifestFilename, JSON.stringify(manifest, undefined, "\t"));
    } catch (err) {
        display.error(`Failed to write '${manifestFilename}`, err);
        process.exit(1);
    }
}

export async function buildThemeHeaders(uniteConfig: IUniteConfiguration,
                                        uniteThemeConfig: IUniteThemeConfiguration): Promise<void> {
    uniteThemeConfig.themeHeaders = [];

    const headers = [
        {
            file: path.join(uniteConfig.dirs.www.assets, "favicon/", "apple-touch-icon.png"),
            header: "<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"./assets/favicon/apple-touch-icon.png\">"
        },
        {
            file: path.join(uniteConfig.dirs.www.assets, "favicon/", "favicon-32x32.png"),
            header: "<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" " +
                "href=\"./assets/favicon/favicon-32x32.png\">"
        },
        {
            file: path.join(uniteConfig.dirs.www.assets, "favicon/", "favicon-16x16.png"),
            header: "<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" " +
                "href=\"./assets/favicon/favicon-16x16.png\">"
        },
        {
            file: path.join(uniteConfig.dirs.www.assets, "favicon/", "manifest.json"),
            header: "<link rel=\"manifest\" href=\"./assets/favicon/manifest.json\">"
        },
        {
            file: path.join(uniteConfig.dirs.www.assets, "favicon/", "safari-pinned-tab.svg"),
            header: "<link rel=\"mask-icon\" href=\"./assets/favicon/safari-pinned-tab.svg\" " +
                "color=\"{THEME_COLOR}\">"
        },
        {
            file: path.join(uniteConfig.dirs.www.assets, "favicon/", "favicon.ico"),
            header: "<link rel=\"shortcut icon\" href=\"./assets/favicon/favicon.ico\">"
        },
        {
            file: path.join(uniteConfig.dirs.www.assets, "favicon/", "browserconfig.xml"),
            header: "<meta name=\"msapplication-config\" content=\"./assets/favicon/browserconfig.xml\">"
        }
    ];

    uniteThemeConfig.themeHeaders.push("<meta name=\"theme-color\" content=\"{THEME_COLOR}\">");

    for (let i = 0; i < headers.length; i++) {
        const headerFileExists = await asyncUtil.fileExists(headers[i].file);
        if (headerFileExists) {
            uniteThemeConfig.themeHeaders.push(headers[i].header);
        }
    }
}

export async function callUniteImage(config: IUniteImageCliCommand): Promise<void> {
    const params = [];

    params.push(config.command);

    for (const key in config) {
        if (key !== "command") {
            params.push(`--${key}=${config[key]}`);
        }
    }

    try {
        await exec.npmRun("unite-image", params);
    } catch (err) {
        display.error("Executing unite-image", err);
        process.exit(1);
    }
}

export async function generateFavIcons(uniteConfig: IUniteConfiguration,
                                       uniteThemeConfig: IUniteThemeConfiguration,
                                       favIconDirectory: string): Promise<void> {

    const images: IUniteImageCliCommand[] = [
        {
            command: "svgToPng",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
            destFile: `${path.join(favIconDirectory, "android-chrome-192x192.png")}`,
            width: 192,
            height: 192,
            marginX: 19,
            marginY: 19,
            background: uniteThemeConfig.backgroundColor
        },
        {
            command: "svgToPng",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
            destFile: `${path.join(favIconDirectory, "android-chrome-512x512.png")}`,
            width: 512,
            height: 512,
            marginX: 51,
            marginY: 51,
            background: uniteThemeConfig.backgroundColor
        },
        {
            command: "svgToPng",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
            destFile: `${path.join(favIconDirectory, "apple-touch-icon.png")}`,
            width: 180,
            height: 180,
            marginX: 18,
            marginY: 18,
            background: uniteThemeConfig.backgroundColor
        },
        {
            command: "svgToPng",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
            destFile: `${path.join(favIconDirectory, "mstile-70x70.png")}`,
            width: 128,
            height: 128,
            marginX: 12,
            marginY: 12
        },
        {
            command: "svgToPng",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
            destFile: `${path.join(favIconDirectory, "mstile-144x144.png")}`,
            width: 144,
            height: 144,
            marginX: 14,
            marginY: 14
        },
        {
            command: "svgToPng",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
            destFile: `${path.join(favIconDirectory, "mstile-150x150.png")}`,
            width: 270,
            height: 270,
            marginX: 67,
            marginY: 67
        },
        {
            command: "svgToPng",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
            destFile: `${path.join(favIconDirectory, "mstile-310x150.png")}`,
            width: 558,
            height: 270,
            marginX: 140,
            marginY: 67
        },
        {
            command: "svgToPng",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
            destFile: `${path.join(favIconDirectory, "mstile-310x310.png")}`,
            width: 558,
            height: 558,
            marginX: 140,
            marginY: 140
        },
        {
            command: "svgToMask",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-tile.svg")}`,
            destFile: `${path.join(favIconDirectory, "safari-pinned-tab.svg")}`
        },
        {
            command: "svgToPng",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-transparent.svg")}`,
            destFile: `${path.join(favIconDirectory, "favicon-16x16.png")}`,
            width: 16,
            height: 16
        },
        {
            command: "svgToPng",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-transparent.svg")}`,
            destFile: `${path.join(favIconDirectory, "favicon-32x32.png")}`,
            width: 32,
            height: 32
        },
        {
            command: "svgToPng",
            sourceFile: `${path.join(uniteConfig.dirs.www.assetsSrc, "theme", "logo-transparent.svg")}`,
            destFile: `${path.join(favIconDirectory, "favicon-48x48.png")}`,
            width: 48,
            height: 48
        },
        {
            command: "pngsToIco",
            sourceFolder: favIconDirectory,
            sourceFiles: "favicon-16x16.png,favicon-32x32.png,favicon-48x48.png",
            destFile: `${path.join(favIconDirectory, "favicon.ico")}`
        }
    ];

    try {
        await util.promisify(mkdirp)(favIconDirectory);
    } catch (err) {
        display.error(`Creating ${favIconDirectory}`, err);
        process.exit(1);
    }

    for (let i = 0; i < images.length; i++) {
        await callUniteImage(images[i]);
    }
}

export async function buildPwa(uniteConfig: IUniteConfiguration,
                               buildConfiguration: IUniteBuildConfiguration,
                               packageJson: IPackageJson,
                               files: {src: string; moveToRoot?: boolean}[],
                               dest: string,
                               includeRoot: boolean): Promise<void> {
    const cacheName = `${packageJson.name}-${packageJson.version}-${buildConfiguration.name}`;
    let cacheFiles = ["./"];

    const globAsync = util.promisify<string, string[]>(glob);
    for (let i = 0; i < files.length; i++) {
        let globFiles = await globAsync(files[i].src);

        if (files[i].moveToRoot) {
            if (includeRoot) {
                const root = files[i].src
                    .replace(/(.*?)\*(?:.*)/, "$1")
                    .replace(/\\/g, "/");
                globFiles = globFiles.map(file => `./${file.replace(root, "")}`);
                cacheFiles = cacheFiles.concat(globFiles);
            }
        } else {
            globFiles = globFiles.map(file => `./${file}`);
            cacheFiles = cacheFiles.concat(globFiles);
        }
    }

    return asyncUtil.stream(gulp.src(path.join(
        uniteConfig.dirs.www.build,
        "assets/pwa/service-worker-template.js"
    ))
        .pipe(replace("{CACHE_NAME}", cacheName))
        .pipe(replace("{CACHE_URLS}", JSON.stringify(cacheFiles, undefined, "\t")))
        .pipe(rename("service-worker.js"))
        .pipe(gulp.dest(dest)));
}

// Generated by UniteJS
