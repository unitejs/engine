/**
 * Pipeline step to generate cordova platform configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { UniteThemeConfiguration } from "../../configuration/models/uniteTheme/uniteThemeConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Cordova extends PipelineStepBase {
    private static PLATFORM: string = "Cordova";
    private static FILENAME: string = "platform-cordova.js";
    private static FILENAME_PROJ: string = "cordova.jsproj";

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.objectCondition(uniteConfiguration.platforms, Cordova.PLATFORM);
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["xml2js"], mainCondition && super.condition(uniteConfiguration.taskManager, "Gulp"));

        const uniteThemeConfiguration = engineVariables.getConfiguration<UniteThemeConfiguration>("UniteTheme");
        if (uniteThemeConfiguration) {
            if (mainCondition) {
                let headers;
                let scriptInclude;
                let scriptStart;
                let scriptEnd;
                if (uniteThemeConfiguration.cordova) {
                    headers = uniteThemeConfiguration.cordova.headers;
                    scriptInclude = uniteThemeConfiguration.cordova.scriptInclude;
                    scriptStart = uniteThemeConfiguration.cordova.scriptStart;
                    scriptEnd = uniteThemeConfiguration.cordova.scriptEnd;
                }
                uniteThemeConfiguration.cordova = {
                    headers: headers || [
                        // tslint:disable-next-line:max-line-length
                        "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;\">",
                        "<meta name=\"format-detection\" content=\"telephone=no\">",
                        "<meta name=\"msapplication-tap-highlight\" content=\"no\">"
                    ],
                    scriptInclude: scriptInclude || [
                        "<script type=\"text/javascript\" src=\"./cordova.js\"></script>"
                    ],
                    scriptStart: scriptStart || [
                        "document.addEventListener('deviceready', function() {"
                    ],
                    scriptEnd: scriptEnd || [
                        "});"
                    ]
                };
            } else {
                delete uniteThemeConfiguration.cordova;
            }
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.folderCreate(logger, fileSystem, engineVariables.platformRootFolder);

        if (ret === 0) {
            const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
            const buildAssetPlatform = fileSystem.pathCombine(engineVariables.www.buildFolder, "/assets/platform/cordova/");

            if (mainCondition && super.condition(uniteConfiguration.taskManager, "Gulp")) {
                const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
                ret = await this.copyFile(logger, fileSystem, assetTasksPlatform, Cordova.FILENAME, buildTasks, Cordova.FILENAME, engineVariables.force);

                const assetPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/assets/platform/cordova/");
                if (ret === 0) {
                    ret = await this.copyFile(logger, fileSystem, assetPlatform, Cordova.FILENAME_PROJ, buildAssetPlatform, Cordova.FILENAME_PROJ, engineVariables.force);
                }
            } else {
                ret = await super.fileDeleteText(logger, fileSystem, buildTasks, Cordova.FILENAME, engineVariables.force);
                if (ret === 0) {
                    ret = await super.fileDeleteText(logger, fileSystem, buildAssetPlatform, Cordova.FILENAME_PROJ, engineVariables.force);
                }
            }
        }

        if (mainCondition) {
            engineVariables.additionalCompletionMessages.push("Make sure you have installed the cordova package globally using:");
            engineVariables.additionalCompletionMessages.push(`   ${engineVariables.packageManager.getInstallCommand("cordova", true)}`);
        }

        return ret;
    }
}
