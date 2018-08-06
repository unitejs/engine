import { EngineCommandBase } from "../engine/engineCommandBase";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IGenerateCommandParams } from "../interfaces/IGenerateCommandParams";
export declare class GenerateCommand extends EngineCommandBase implements IEngineCommand<IGenerateCommandParams> {
    run(args: IGenerateCommandParams): Promise<number>;
    private generateFromTemplate;
    private copyFiles;
}
