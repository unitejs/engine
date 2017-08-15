/**
 * Tests for Engine.
 */
import * as Chai from "chai";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../dist/configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../../../dist/engine/enginePipelineStepBase";
import { EngineVariables } from "../../../../dist/engine/engineVariables";

class TestPipelineStep extends EnginePipelineStepBase {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return Promise.resolve(0);
    }
}

describe("EnginePipelineStepBase", () => {
    it("can be created", async() => {
        const obj = new TestPipelineStep();
        Chai.should().exist(obj);
    });
});
