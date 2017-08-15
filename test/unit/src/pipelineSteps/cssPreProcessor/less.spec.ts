/**
 * Tests for Less.
 */
import * as Chai from "chai";
import { Less } from "../../../../../dist/pipelineSteps/cssPreProcessor/less";

describe("Less", () => {
    it("can be created", async() => {
        const obj = new Less();
        Chai.should().exist(obj);
    });
});
