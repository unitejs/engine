/**
 * Tests for Jasmine.
 */
import * as Chai from "chai";
import { Jasmine } from "../../../../../dist/pipelineSteps/testFramework/jasmine";

describe("Jasmine", () => {
    it("can be created", async() => {
        const obj = new Jasmine();
        Chai.should().exist(obj);
    });
});
