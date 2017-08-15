/**
 * Tests for GitIgnore.
 */
import * as Chai from "chai";
import { GitIgnore } from "../../../../../dist/pipelineSteps/content/gitIgnore";

describe("GitIgnore", () => {
    it("can be created", async() => {
        const obj = new GitIgnore();
        Chai.should().exist(obj);
    });
});
