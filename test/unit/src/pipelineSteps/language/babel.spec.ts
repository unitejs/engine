/**
 * Tests for Babel.
 */
import * as Chai from "chai";
import { Babel } from "../../../../../dist/pipelineSteps/language/babel";

describe("Babel", () => {
    it("can be created", async() => {
        const obj = new Babel();
        Chai.should().exist(obj);
    });
});
