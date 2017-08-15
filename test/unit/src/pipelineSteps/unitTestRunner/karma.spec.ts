/**
 * Tests for Karma.
 */
import * as Chai from "chai";
import { Karma } from "../../../../../dist/pipelineSteps/unitTestRunner/karma";

describe("Karma", () => {
    it("can be created", async() => {
        const obj = new Karma();
        Chai.should().exist(obj);
    });
});
