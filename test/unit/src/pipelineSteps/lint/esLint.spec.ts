/**
 * Tests for EsLint.
 */
import * as Chai from "chai";
import { EsLint } from "../../../../../dist/pipelineSteps/lint/esLint";

describe("EsLint", () => {
    it("can be created", async() => {
        const obj = new EsLint();
        Chai.should().exist(obj);
    });
});
