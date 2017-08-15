/**
 * Tests for PostCss.
 */
import * as Chai from "chai";
import { PostCss } from "../../../../../dist/pipelineSteps/cssPostProcessor/postCss";

describe("PostCss", () => {
    it("can be created", async() => {
        const obj = new PostCss();
        Chai.should().exist(obj);
    });
});
