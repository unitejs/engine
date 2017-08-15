/**
 * Tests for UniteConfigurationDirectories.
 */
import * as Chai from "chai";
import { UniteConfigurationDirectories } from "../../../../../dist/pipelineSteps/scaffold/uniteConfigurationDirectories";

describe("UniteConfigurationDirectories", () => {
    it("can be created", async() => {
        const obj = new UniteConfigurationDirectories();
        Chai.should().exist(obj);
    });
});
