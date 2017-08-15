/**
 * Tests for UniteConfigurationJson.
 */
import * as Chai from "chai";
import { UniteConfigurationJson } from "../../../../../dist/pipelineSteps/scaffold/uniteConfigurationJson";

describe("UniteConfigurationJson", () => {
    it("can be created", async() => {
        const obj = new UniteConfigurationJson();
        Chai.should().exist(obj);
    });
});
