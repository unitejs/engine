/**
 * Tests for Web.
 */
import * as Chai from "chai";
import { Web } from "../../../../../dist/pipelineSteps/platform/web";

describe("Web", () => {
    it("can be created", async() => {
        const obj = new Web();
        Chai.should().exist(obj);
    });
});
