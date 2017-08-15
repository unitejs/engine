/**
 * Tests for Stylus.
 */
import * as Chai from "chai";
import { Stylus } from "../../../../../dist/pipelineSteps/cssPreProcessor/stylus";

describe("Stylus", () => {
    it("can be created", async() => {
        const obj = new Stylus();
        Chai.should().exist(obj);
    });
});
