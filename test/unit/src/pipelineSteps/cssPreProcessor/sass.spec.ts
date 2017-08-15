/**
 * Tests for Sass.
 */
import * as Chai from "chai";
import { Sass } from "../../../../../dist/pipelineSteps/cssPreProcessor/sass";

describe("Sass", () => {
    it("can be created", async() => {
        const obj = new Sass();
        Chai.should().exist(obj);
    });
});
