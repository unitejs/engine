/**
 * Tests for GenNamePascalPipelineStep.
 */
import chai from "chai";
import { GenNamePascalPipelineStep } from "../../src/gen-name-snake";

describe("GenNamePascalValueConverter", () => {
    it("can be created", () => {
        const obj = new GenNamePascalPipelineStep();
        chai.should().exist(obj);
    });
});
