/**
 * Tests for OutputDirectory.
 */
import * as Chai from "chai";
import { OutputDirectory } from "../../../../../dist/pipelineSteps/scaffold/outputDirectory";

describe("OutputDirectory", () => {
    it("can be created", async() => {
        const obj = new OutputDirectory();
        Chai.should().exist(obj);
    });
});
