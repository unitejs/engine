/**
 * Interface for main engine.
 */
import { IEngineCommandParams } from "./IEngineCommandParams";

export interface IEngine {
    version(): string;

    initialise(): Promise<number>;

    command<T extends IEngineCommandParams>(commandName: string, args: T): Promise<number>;
}
