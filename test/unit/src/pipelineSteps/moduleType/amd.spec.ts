/**
 * Tests for Amd.
 */
import * as Chai from "chai";
import { Amd } from "../../../../../dist/pipelineSteps/moduleType/amd";

describe("Amd", () => {
    it("can be created", async() => {
        const obj = new Amd();
        Chai.should().exist(obj);
    });
});
