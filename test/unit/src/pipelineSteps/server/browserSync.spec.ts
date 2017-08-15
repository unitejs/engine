/**
 * Tests for BrowserSync.
 */
import * as Chai from "chai";
import { BrowserSync } from "../../../../../dist/pipelineSteps/server/browserSync";

describe("BrowserSync", () => {
    it("can be created", async() => {
        const obj = new BrowserSync();
        Chai.should().exist(obj);
    });
});
