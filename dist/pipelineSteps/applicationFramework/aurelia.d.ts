/**
 * Pipeline step to generate scaffolding for Aurelia application.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { SharedAppFramework } from "./sharedAppFramework";
export declare class Aurelia extends SharedAppFramework {
    process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    private toggleAllPackages(uniteConfiguration, engineVariables);
    private toggleClientPackages(uniteConfiguration, engineVariables, location, clientPackages);
}
