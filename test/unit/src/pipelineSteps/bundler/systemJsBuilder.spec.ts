/**
 * Tests for SystemJsBuilder.
 */
import * as Chai from "chai";
import { SystemJsBuilder } from "../../../../../dist/pipelineSteps/bundler/systemJsBuilder";

describe("SystemJsBuilder", () => {
    it("can be created", async() => {
        const obj = new SystemJsBuilder();
        Chai.should().exist(obj);
    });
});
