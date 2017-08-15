/**
 * Tests for MochaChai.
 */
import * as Chai from "chai";
import { MochaChai } from "../../../../../dist/pipelineSteps/testFramework/mochaChai";

describe("MochaChai", () => {
    it("can be created", async() => {
        const obj = new MochaChai();
        Chai.should().exist(obj);
    });
});
