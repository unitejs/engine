/**
 * Tests for WebdriverIo.
 */
import * as Chai from "chai";
import { WebdriverIo } from "../../../../../dist/pipelineSteps/e2eTestRunner/webdriverIo";

describe("WebdriverIo", () => {
    it("can be created", async() => {
        const obj = new WebdriverIo();
        Chai.should().exist(obj);
    });
});
