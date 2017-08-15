/**
 * Tests for SharedAppFramework.
 */
import * as Chai from "chai";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { SharedAppFramework } from "../../../../../dist/pipelineSteps/applicationFramework/sharedAppFramework";

class TestSharedAppFramework extends SharedAppFramework {
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        return 0;
    }
}

describe("SharedAppFramework", () => {
    it("can be created", async() => {
        const obj = new TestSharedAppFramework();
        Chai.should().exist(obj);
    });
});
