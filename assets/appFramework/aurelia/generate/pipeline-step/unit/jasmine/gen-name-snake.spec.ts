/**
 * Tests for GenNamePascalPipelineStep.
 */
import { GenNamePascalPipelineStep } from "../../src/gen-name-snake";

describe("GenNamePascalPipelineStep", () => {
    it("can be created", () => {
        const obj = new GenNamePascalPipelineStep();
        expect(obj).toBeDefined();
    });
});
