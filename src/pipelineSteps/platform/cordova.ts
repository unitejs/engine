/**
 * Pipeline step to generate cordova platform configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
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
                uniteThemeConfiguration.cordova = uniteThemeConfiguration.cordova || [];
                ArrayHelper.addRemove(uniteThemeConfiguration.cordova,
                                      "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self' data: gap: https://ssl.gstatic.com " +
                                      "'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;\">",
                                      mainCondition,
                                      (obj, item) => item.indexOf("Content-Security-Policy") >= 0);

                ArrayHelper.addRemove(uniteThemeConfiguration.cordova,
                                      "<meta name=\"format-detection\" content=\"telephone=no\">",
                                      mainCondition,
                                      (obj, item) => item.indexOf("format-detection") >= 0);

                ArrayHelper.addRemove(uniteThemeConfiguration.cordova,
                                      "<meta name=\"msapplication-tap-highlight\" content=\"no\">",
                                      mainCondition,
                                      (obj, item) => item.indexOf("msapplication-tap-highlight") >= 0);

                ArrayHelper.addRemove(uniteThemeConfiguration.cordova,
                                      "<script type=\"text/javascript\" src=\"./cordova.js\"></script>",
                                      mainCondition,
                                      (obj, item) => item.indexOf("cordova.js") >= 0);
            } else {
                delete uniteThemeConfiguration.cordova;
            }
        }

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.folderCreate(logger, fileSystem, engineVariables.platformRootFolder);

        if (ret === 0) {
            const buildTasks = fileSystem.pathCombine(engineVariables.www.build, "/tasks/");
            const buildAssetPlatform = fileSystem.pathCombine(engineVariables.www.build, "/assets/platform/cordova/");

            if (mainCondition && super.condition(uniteConfiguration.taskManager, "Gulp")) {
                const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/dist/tasks/platform/");
                ret = await this.copyFile(logger, fileSystem, assetTasksPlatform, Cordova.FILENAME, buildTasks, Cordova.FILENAME, engineVariables.force, false,
                                          { "\\\"../util/": ["\"./util/"] });

                const assetPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/assets/platform/cordova/");
                if (ret === 0) {
                    ret = await this.copyFile(logger, fileSystem, assetPlatform, Cordova.FILENAME_PROJ, buildAssetPlatform, Cordova.FILENAME_PROJ, engineVariables.force, false);
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
