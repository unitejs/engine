/**
 * Tests for Css.
 */
import * as Chai from "chai";
import { Css } from "../../../../../dist/pipelineSteps/cssPreProcessor/css";

describe("Css", () => {
    it("can be created", async() => {
        const obj = new Css();
        Chai.should().exist(obj);
    });
});
