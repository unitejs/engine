/**
 * Tests for TsLint.
 */
import * as Chai from "chai";
import { TsLint } from "../../../../../dist/pipelineSteps/lint/tsLint";

describe("TsLint", () => {
    it("can be created", async() => {
        const obj = new TsLint();
        Chai.should().exist(obj);
    });
});
