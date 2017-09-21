import { EngineCommandBase } from "../engine/engineCommandBase";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IGenerateCommandParams } from "../interfaces/IGenerateCommandParams";
export declare class GenerateCommand extends EngineCommandBase implements IEngineCommand<IGenerateCommandParams> {
    run(args: IGenerateCommandParams): Promise<number>;
    private generateFromTemplate(args, uniteConfiguration, generateTemplatesFolder, generateTemplate);
    private copyFiles(generateTemplatesFolder, filenames, destRootFolder, subFolder, templateSubFolder, possibleExtensions, substitutions);
    private generateSubstitutions(name, uniteConfiguration);
    private stringSubstitutions(substitutions, input);
}
