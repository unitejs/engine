/**
 * Gulp utils for unite configuration.
 */
import * as fs from "fs";
import * as minimist from "minimist";
import * as path from "path";
import * as util from "util";
import { IUniteBuildConfiguration } from "../../types/IUniteBuildConfiguration";
import { IUniteConfiguration } from "../../types/IUniteConfiguration";
import { IUniteThemeConfiguration } from "../../types/IUniteThemeConfiguration";
import * as display from "./display";
import * as envUtil from "./env-util";

export async function getUniteConfig(): Promise<IUniteConfiguration> {
    let uc = envUtil.get<IUniteConfiguration>("uniteConfig");

    if (uc) {
        return uc;
    } else {
        try {
            const data = await util.promisify(fs.readFile)("../unite.json");
            uc = JSON.parse(data.toString());
            envUtil.set("uniteConfig", uc);
            return uc;
        } catch (err) {
            display.error("Reading unite.json", err);
            process.exit(1);
            return undefined;
        }
    }
}

export async function setUniteConfig(uniteConfig: IUniteConfiguration): Promise<void> {
    try {
        envUtil.set("uniteConfig", uniteConfig);
        await util.promisify(fs.writeFile)(
            "../unite.json",
            JSON.stringify(uniteConfig, undefined, "\t")
        );
    } catch (err) {
        display.error("Writing unite-theme.json", err);
        process.exit(1);
    }
}

export async function getUniteThemeConfig(uniteConfig: IUniteConfiguration): Promise<IUniteThemeConfiguration> {
    try {
        const data = await util.promisify(fs.readFile)(path.join(
            uniteConfig.dirs.www.assetsSrc,
            "/theme/unite-theme.json"
        ));
        return JSON.parse(data.toString());
    } catch (err) {
        display.error("Reading unite-theme.json", err);
        process.exit(1);
        return undefined;
    }
}

export async function setUniteThemeConfig(uniteConfig: IUniteConfiguration, uniteThemeConfig: IUniteThemeConfiguration) : Promise<void> {
    try {
        await util.promisify(fs.writeFile)(
            path.join(uniteConfig.dirs.www.assetsSrc, "/theme/unite-theme.json"),
            JSON.stringify(uniteThemeConfig, undefined, "\t")
        );
    } catch (err) {
        display.error("Writing unite-theme.json", err);
        process.exit(1);
    }
}

export function getBuildConfiguration(uniteConfig: IUniteConfiguration, showInfo: boolean): IUniteBuildConfiguration {
    const knownOptions = {
        default: { buildConfiguration: "dev" },
        string: ["buildConfiguration"]
    };

    const options = minimist(process.argv.slice(2), knownOptions);

    let buildConfiguration: IUniteBuildConfiguration = null;

    if (uniteConfig &&
        uniteConfig.buildConfigurations &&
        uniteConfig.buildConfigurations[options.buildConfiguration]) {
        buildConfiguration = uniteConfig.buildConfigurations[options.buildConfiguration];
        if (showInfo) {
            display.info("Build Configuration", options.buildConfiguration);
        }
    } else {
        display.error(`Unknown build configuration '${options.buildConfiguration}' in unite.json, aborting.`);
        process.exit(1);
    }

    buildConfiguration = buildConfiguration || <IUniteBuildConfiguration>{};
    if (buildConfiguration.bundle === undefined) {
        buildConfiguration.bundle = false;
    }
    if (buildConfiguration.sourcemaps === undefined) {
        buildConfiguration.sourcemaps = true;
    }
    if (buildConfiguration.minify === undefined) {
        buildConfiguration.minify = false;
    }
    if (buildConfiguration.pwa === undefined) {
        buildConfiguration.pwa = false;
    }

    buildConfiguration.name = options.buildConfiguration;
    if (showInfo) {
        display.info("Sourcemaps", buildConfiguration.sourcemaps);
        display.info("Minify", buildConfiguration.minify);
        display.info("Bundle", buildConfiguration.bundle);
        display.info("Pwa", buildConfiguration.pwa);
    }

    return buildConfiguration;
}

export function extensionMap(extensions: string[]): string {
    if (extensions.length === 1) {
        return extensions[0];
    } else {
        return `{${extensions.join(",")}}`;
    }
}

// Generated by UniteJS