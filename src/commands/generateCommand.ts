/**
 * Generate Command
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
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
                    let template = generateTemplates[templateKey];
                    const sharedGenerateTemplatesFolder = this._fileSystem.pathCombine(this._engineAssetsFolder, `appFramework/shared/generate/`);
                    if (generateTemplates[templateKey].isShared) {
                        const sharedExists = await this._fileSystem.fileExists(sharedGenerateTemplatesFolder, "generate-templates.json");

                        if (sharedExists) {
                            const sharedGenerateTemplates = await this._fileSystem.fileReadJson<IUniteGenerateTemplates>(sharedGenerateTemplatesFolder, "generate-templates.json");

                            if (sharedGenerateTemplates[templateKey]) {
                                template = ObjectHelper.merge(template, sharedGenerateTemplates[templateKey]);
                            } else {
                                this._logger.error(`Can not find a type of '${args.type}' in the shared templates'`);
                                return 1;
                            }
                        } else {
                            this._logger.error(`There are no shared generate-templates and shared template '${args.type}' is required`);
                            return 1;
                        }
                    }
                    return await this.generateFromTemplate(args, uniteConfiguration, generateTemplates[templateKey].isShared ? sharedGenerateTemplatesFolder : generateTemplatesFolder, template);
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
        substitutions.ADDITIONAL_EXTENSION = generateTemplate.additionalExtension !== undefined &&
            generateTemplate.additionalExtension !== null &&
            generateTemplate.additionalExtension.length > 0 ? `.${generateTemplate.additionalExtension}` : "";

        // See where we are in relation to the www folder
        const baseDirectory = this._fileSystem.pathAbsolute("./");
        const wwwFolder = this._fileSystem.pathAbsolute(this._fileSystem.pathCombine(args.outputDirectory, uniteConfiguration.dirs.wwwRoot));
        const srcFolder = this._fileSystem.pathAbsolute(this._fileSystem.pathCombine(wwwFolder, uniteConfiguration.dirs.www.src));

        // If we are somewhere in the srcFolder use that as a starting point, otherwise just use src root
        const startSrcFolder = baseDirectory.startsWith(srcFolder) ? baseDirectory : srcFolder;

        // Calculate any subFolder based on arg or default with substitutions
        const subFolder = args.subFolder !== undefined && args.subFolder !== null ? args.subFolder :
            generateTemplate.defaultFolder !== undefined && generateTemplate.defaultFolder !== null ? TemplateHelper.replaceSubstitutions(substitutions, generateTemplate.defaultFolder) : "";

        // Now combine the output folder
        const srcOutputFolder = this._fileSystem.pathCombine(startSrcFolder, subFolder);

        // Find the relativee from srcFolder to srcOutputFolder so we can combine for other folder structures
        const srcRelative = this._fileSystem.pathFileRelative(srcFolder, srcOutputFolder);

        let ret = await this.copyFiles(generateTemplatesFolder,
                                       generateTemplate.sourceFiles,
                                       srcOutputFolder,
                                       `${args.type}/src`,
                                       uniteConfiguration.sourceExtensions,
                                       substitutions);

        if (ret === 0) {
            ret = await this.copyFiles(generateTemplatesFolder,
                                       generateTemplate.viewFiles,
                                       srcOutputFolder,
                                       `${args.type}/view`,
                                       uniteConfiguration.viewExtensions,
                                       substitutions);
        }

        if (ret === 0) {
            ret = await this.copyFiles(generateTemplatesFolder,
                                       generateTemplate.styleFiles,
                                       srcOutputFolder,
                                       `${args.type}/style`,
                                       [uniteConfiguration.styleExtension],
                                       substitutions);
        }

        if (ret === 0 && uniteConfiguration.unitTestRunner !== "None") {
            const unitSrcFolder = this._fileSystem.pathAbsolute(this._fileSystem.pathCombine(wwwFolder, uniteConfiguration.dirs.www.unitTestSrc));
            const unitSrcOutputFolder = this._fileSystem.pathCombine(unitSrcFolder, srcRelative);
            substitutions.GEN_UNIT_TEST_RELATIVE = this._fileSystem.pathToWeb(this._fileSystem.pathDirectoryRelative(unitSrcOutputFolder, srcOutputFolder));
            if (substitutions.GEN_UNIT_TEST_RELATIVE.startsWith("./")) {
                substitutions.GEN_UNIT_TEST_RELATIVE = substitutions.GEN_UNIT_TEST_RELATIVE.substring(2);
            }

            ret = await this.copyFiles(generateTemplatesFolder,
                                       generateTemplate.unitTestFiles,
                                       unitSrcOutputFolder,
                                       `${args.type}/unit/${uniteConfiguration.unitTestFramework.toLowerCase()}`,
                                       uniteConfiguration.sourceExtensions,
                                       substitutions);
        }

        if (ret === 0 && uniteConfiguration.e2eTestRunner !== "None") {
            const e2eSrcFolder = this._fileSystem.pathAbsolute(this._fileSystem.pathCombine(wwwFolder, uniteConfiguration.dirs.www.e2eTestSrc));
            const e2eSrcOutputFolder = this._fileSystem.pathCombine(e2eSrcFolder, srcRelative);
            substitutions.GEN_E2E_TEST_RELATIVE = this._fileSystem.pathToWeb(this._fileSystem.pathDirectoryRelative(e2eSrcOutputFolder, srcOutputFolder));
            if (substitutions.GEN_E2E_TEST_RELATIVE.startsWith("./")) {
                substitutions.GEN_E2E_TEST_RELATIVE = substitutions.GEN_E2E_TEST_RELATIVE.substring(2);
            }

            ret = await this.copyFiles(generateTemplatesFolder,
                                       generateTemplate.e2eTestFiles,
                                       e2eSrcOutputFolder,
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
                            destFolder: string,
                            templateSubFolder: string,
                            possibleExtensions: string[],
                            substitutions: { [id: string]: string }): Promise<number> {
        if (filenames && filenames.length > 0) {
            const srcFolder = this._fileSystem.pathCombine(generateTemplatesFolder, templateSubFolder);

            for (let i = 0; i < filenames.length; i++) {
                const srcFilename = filenames[i];

                let doneCopy = false;
                for (let j = 0; j < possibleExtensions.length && !doneCopy; j++) {
                    let srcFilename2 = srcFilename.replace("{EXTENSION}", possibleExtensions[j]);
                    srcFilename2 = srcFilename2.replace("{ADDITIONAL_EXTENSION}", "");
                    let destFilename = TemplateHelper.replaceSubstitutions(substitutions, srcFilename);
                    destFilename = destFilename.replace("{EXTENSION}", possibleExtensions[j]);

                    try {
                        const destExists = await this._fileSystem.fileExists(destFolder, destFilename);

                        if (destExists) {
                            this._logger.error(`Destination file exists, aborting`, undefined, { srcFolder, srcFilename2, destFolder, destFilename });
                            return 1;
                        } else {
                            const exists = await this._fileSystem.fileExists(srcFolder, srcFilename2);

                            if (exists) {
                                let content = await this._fileSystem.fileReadText(srcFolder, srcFilename2);

                                if (content.startsWith("!")) {
                                    this._logger.error(content.substr(1));
                                    return 1;
                                } else {
                                    content = TemplateHelper.replaceSubstitutions(substitutions, content);

                                    await this._fileSystem.directoryCreate(destFolder);

                                    await this._fileSystem.fileWriteText(destFolder, destFilename, content);

                                    doneCopy = true;
                                }
                            }
                        }
                    } catch (err) {
                        this._logger.error(`There was an generating from the template`, err, { srcFolder, srcFilename2, destFolder, destFilename });
                        return 1;
                    }
                }
                if (!doneCopy) {
                    this._logger.error(`Can not find a source for '${srcFilename}' with the possible extensions [${possibleExtensions.join(", ")}]`);
                    return 1;
                }
            }
        }

        return 0;
    }
}
