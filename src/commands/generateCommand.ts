/**
 * Generate Command
 */
import { ParameterValidation } from "unitejs-framework/dist/helpers/parameterValidation";
import { IUniteGenerateTemplate } from "../configuration/models/unite/IUniteGenerateTemplate";
import { IUniteGenerateTemplates } from "../configuration/models/unite/IUniteGenerateTemplates";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineCommandBase } from "../engine/engineCommandBase";
import { TemplateHelper } from "../helpers/templateHelper";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IGenerateCommandParams } from "../interfaces/IGenerateCommandParams";

export class GenerateCommand extends EngineCommandBase implements IEngineCommand<IGenerateCommandParams> {
    public async run(args: IGenerateCommandParams): Promise<number> {
        const uniteConfiguration = await this.loadConfiguration(args.outputDirectory, undefined, undefined, false);

        if (!uniteConfiguration) {
            this._logger.error("There is no unite.json to use for configuration.");
            return 1;
        }

        if (!ParameterValidation.notEmpty(this._logger, "name", args.name)) {
            return 1;
        }

        if (!ParameterValidation.notEmpty(this._logger, "type", args.type)) {
            return 1;
        }

        this._logger.info("");

        try {
            const generateTemplatesFolder = this._fileSystem.pathCombine(this._engineAssetsFolder, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/generate/`);

            const exists = await this._fileSystem.fileExists(generateTemplatesFolder, "generate-templates.json");

            if (exists) {
                const generateTemplates = await this._fileSystem.fileReadJson<IUniteGenerateTemplates>(generateTemplatesFolder, "generate-templates.json");

                const keys = Object.keys(generateTemplates);

                const typeLower = args.type.toLowerCase();

                const templateKey = keys.find(k => k.toLowerCase() === typeLower);

                if (templateKey) {
                    return await this.generateFromTemplate(args, uniteConfiguration, generateTemplatesFolder, generateTemplates[templateKey]);
                } else {
                    this._logger.error(`Can not find a type of '${args.type}' for applicationFramework '${uniteConfiguration.applicationFramework}, possible values are [${keys.join(", ")}]'`);
                    return 1;
                }
            } else {
                this._logger.error(`There are no generate-templates for applicationFramework '${uniteConfiguration.applicationFramework}'`);
                return 1;
            }
        } catch (err) {
            this._logger.error(`There was an error loading generate-templates for applicationFramework '${uniteConfiguration.applicationFramework}'`, err);
            return 1;
        }
    }

    private async generateFromTemplate(args: IGenerateCommandParams,
                                       uniteConfiguration: UniteConfiguration,
                                       generateTemplatesFolder: string,
                                       generateTemplate: IUniteGenerateTemplate): Promise<number> {

        const substitutions = TemplateHelper.generateSubstitutions("GEN_NAME", args.name);

        const subFolder = args.subFolder !== undefined && args.subFolder !== null ? args.subFolder :
            generateTemplate.defaultFolder !== undefined && generateTemplate.defaultFolder !== null ? TemplateHelper.replaceSubstitutions(substitutions, generateTemplate.defaultFolder) : "";

        substitutions.GEN_SUB_FOLDER = subFolder.length > 0 ? `${subFolder}/` : subFolder;
        substitutions.GEN_TEST_ROOT = "../".repeat(subFolder.split("/").length + 3);

        const wwwRootFolder = this._fileSystem.pathCombine(args.outputDirectory, uniteConfiguration.dirs.wwwRoot);

        let ret = await this.copyFiles(generateTemplatesFolder,
                                       generateTemplate.sourceFiles,
                                       this._fileSystem.pathCombine(wwwRootFolder, uniteConfiguration.dirs.www.src),
                                       subFolder,
                                       `${args.type}/src`,
                                       uniteConfiguration.sourceExtensions,
                                       substitutions);

        if (ret === 0) {
            ret = await this.copyFiles(generateTemplatesFolder,
                                       generateTemplate.viewFiles,
                                       this._fileSystem.pathCombine(wwwRootFolder, uniteConfiguration.dirs.www.src),
                                       subFolder,
                                       `${args.type}/view`,
                                       uniteConfiguration.viewExtensions,
                                       substitutions);
        }

        if (ret === 0) {
            ret = await this.copyFiles(generateTemplatesFolder,
                                       generateTemplate.styleFiles,
                                       this._fileSystem.pathCombine(wwwRootFolder, uniteConfiguration.dirs.www.src),
                                       subFolder,
                                       `${args.type}/style`,
                                       [ uniteConfiguration.styleExtension ],
                                       substitutions);
        }

        if (ret === 0 && uniteConfiguration.unitTestRunner !== "None") {
            ret = await this.copyFiles(generateTemplatesFolder,
                                       generateTemplate.unitTestFiles,
                                       this._fileSystem.pathCombine(wwwRootFolder, uniteConfiguration.dirs.www.unitTestSrc),
                                       subFolder,
                                       `${args.type}/unit/${uniteConfiguration.unitTestFramework.toLowerCase()}`,
                                       uniteConfiguration.sourceExtensions,
                                       substitutions);
        }

        if (ret === 0 && uniteConfiguration.e2eTestRunner !== "None") {
            ret = await this.copyFiles(generateTemplatesFolder,
                                       generateTemplate.e2eTestFiles,
                                       this._fileSystem.pathCombine(wwwRootFolder, uniteConfiguration.dirs.www.e2eTestSrc),
                                       subFolder,
                                       `${args.type}/e2e/${uniteConfiguration.unitTestFramework.toLowerCase()}`,
                                       uniteConfiguration.sourceExtensions,
                                       substitutions);
        }

        if (ret === 0) {
            this._logger.banner("Successfully Completed.");
        }

        return ret;
    }

    private async copyFiles(generateTemplatesFolder: string,
                            filenames: string[],
                            destRootFolder: string,
                            subFolder: string,
                            templateSubFolder: string,
                            possibleExtensions: string[],
                            substitutions: { [id: string]: string }): Promise<number> {
        if (filenames && filenames.length > 0) {
            const srcFolder = this._fileSystem.pathCombine(generateTemplatesFolder, templateSubFolder);
            const destFolder = this._fileSystem.pathCombine(destRootFolder, subFolder);

            for (let i = 0; i < filenames.length; i++) {
                const srcFilename = filenames[i];

                let doneCopy = false;
                for (let j = 0; j < possibleExtensions.length && !doneCopy; j++) {
                    const srcFilename2 = srcFilename.replace("{EXTENSION}", possibleExtensions[j]);
                    let destFilename = TemplateHelper.replaceSubstitutions(substitutions, srcFilename);
                    destFilename = destFilename.replace("{EXTENSION}", possibleExtensions[j]);

                    try {
                        const exists = await this._fileSystem.fileExists(srcFolder, srcFilename2);

                        if (exists) {
                            let content = await this._fileSystem.fileReadText(srcFolder, srcFilename2);

                            content = TemplateHelper.replaceSubstitutions(substitutions, content);

                            await this._fileSystem.directoryCreate(destFolder);

                            await this._fileSystem.fileWriteText(destFolder, destFilename, content);

                            doneCopy = true;
                        }
                    } catch (err) {
                        this._logger.error(`There was an generating from the template`, err, { srcFolder, srcFilename2, destFolder, destFilename });
                        return 1;
                    }

                    if (!doneCopy) {
                        this._logger.error(`Can not find a source for '${srcFilename}' with the possible extensions [${possibleExtensions.join(", ")}]`);
                        return 1;
                    }
                }
            }
        }

        return 0;
    }
}
