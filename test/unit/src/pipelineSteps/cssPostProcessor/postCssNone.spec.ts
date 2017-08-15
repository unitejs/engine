/**
 * Tests for PostCssNone.
 */
import * as Chai from "chai";
import { PostCssNone } from "../../../../../dist/pipelineSteps/cssPostProcessor/postCssNone";

describe("PostCssNone", () => {
    it("can be created", async() => {
        const obj = new PostCssNone();
        Chai.should().exist(obj);
    });
});
