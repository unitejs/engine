/**
 * Tests for Browserify.
 */
import * as Chai from "chai";
import { Browserify } from "../../../../../dist/pipelineSteps/bundler/browserify";

describe("Browserify", () => {
    it("can be created", async() => {
        const obj = new Browserify();
        Chai.should().exist(obj);
    });
});
