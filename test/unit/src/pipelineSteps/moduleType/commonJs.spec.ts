/**
 * Tests for CommonJs.
 */
import * as Chai from "chai";
import { CommonJs } from "../../../../../dist/pipelineSteps/moduleType/commonJs";

describe("CommonJs", () => {
    it("can be created", async() => {
        const obj = new CommonJs();
        Chai.should().exist(obj);
    });
});
