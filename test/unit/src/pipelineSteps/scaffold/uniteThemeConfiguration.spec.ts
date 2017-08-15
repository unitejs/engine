/**
 * Tests for UniteThemeConfigurationJson.
 */
import * as Chai from "chai";
import { UniteThemeConfigurationJson } from "../../../../../dist/pipelineSteps/scaffold/uniteThemeConfigurationJson";

describe("UniteThemeConfigurationJson", () => {
    it("can be created", async() => {
        const obj = new UniteThemeConfigurationJson();
        Chai.should().exist(obj);
    });
});
