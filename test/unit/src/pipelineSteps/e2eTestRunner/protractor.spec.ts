/**
 * Tests for Protractor.
 */
import * as Chai from "chai";
import { Protractor } from "../../../../../dist/pipelineSteps/e2eTestRunner/protractor";

describe("Protractor", () => {
    it("can be created", async() => {
        const obj = new Protractor();
        Chai.should().exist(obj);
    });
});
