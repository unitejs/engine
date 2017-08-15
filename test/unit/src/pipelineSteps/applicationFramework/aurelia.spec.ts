/**
 * Tests for Aurelia.
 */
import * as Chai from "chai";
import { Aurelia } from "../../../../../dist/pipelineSteps/applicationFramework/Aurelia";

describe("Aurelia", () => {
    it("can be created", async() => {
        const obj = new Aurelia();
        Chai.should().exist(obj);
    });
});
