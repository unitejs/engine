/**
 * Tests for SystemJs.
 */
import * as Chai from "chai";
import { SystemJs } from "../../../../../dist/pipelineSteps/moduleType/systemJs";

describe("SystemJs", () => {
    it("can be created", async() => {
        const obj = new SystemJs();
        Chai.should().exist(obj);
    });
});
