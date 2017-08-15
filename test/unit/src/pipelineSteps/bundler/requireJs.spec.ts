/**
 * Tests for RequireJs.
 */
import * as Chai from "chai";
import { RequireJs } from "../../../../../dist/pipelineSteps/bundler/requireJs";

describe("RequireJs", () => {
    it("can be created", async() => {
        const obj = new RequireJs();
        Chai.should().exist(obj);
    });
});
