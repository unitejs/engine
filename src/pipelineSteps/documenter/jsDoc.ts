/**
 * Pipeline step to generate jsdoc configuration.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { JsDocConfiguration } from "../../configuration/models/jsDoc/jsDocConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class JsDoc extends PipelineStepBase {
    private static FILENAME: string = ".jsdoc.json";

    private _configuration: JsDocConfiguration;

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.documenter, "JSDoc");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (!super.condition(uniteConfiguration.sourceLanguage, "JavaScript")) {
                logger.error("You can only use JSDoc when the source language is JavaScript");
                return 1;
            }

            return super.fileReadJson<JsDocConfiguration>(logger, fileSystem, engineVariables.wwwRootFolder, JsDoc.FILENAME, engineVariables.force, async (obj) => {
                this._configuration = obj;

                this.configDefaults(fileSystem, engineVariables);

                return 0;
            });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["jsdoc",
                                            "jsdoc-babel",
                                            "babel-core",
                                            "babel-preset-env",
                                            "babel-plugin-transform-decorators-legacy",
                                            "babel-plugin-transform-class-properties"],
                                            mainCondition);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.folderCreate(logger, fileSystem, engineVariables.docsRootFolder);

        if (ret === 0) {
            ret = await super.fileToggleJson(logger,
                                             fileSystem,
                                             engineVariables.wwwRootFolder,
                                             JsDoc.FILENAME,
                                             engineVariables.force,
                                             mainCondition,
                                             async () => this._configuration);
        }

        return ret;
    }

    private configDefaults(fileSystem: IFileSystem, engineVariables: EngineVariables): void {
        const defaultConfiguration = new JsDocConfiguration();

        defaultConfiguration.tags = {
            allowUnknownTags: true
        };

        defaultConfiguration.opts = {
            destination: fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.docsRootFolder))
                .replace(/^\.\//, "")
        };

        defaultConfiguration.plugins = [
            "plugins/markdown",
            "node_modules/jsdoc-babel"
        ];

        defaultConfiguration.babel = new BabelConfiguration();
        defaultConfiguration.babel.plugins = [
            "transform-decorators-legacy",
            "transform-class-properties"
        ];

        defaultConfiguration.babel.babelrc = false;

        defaultConfiguration.sourceType = "module";
        defaultConfiguration.source = {
            include: [
                "./README.md",
                fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.src))
            ],
            includePattern: ".+\\.js(x)?$"
        };

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("JsDoc", this._configuration);
    }
}
