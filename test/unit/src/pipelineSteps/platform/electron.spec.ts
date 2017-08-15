/**
 * Tests for Electron.
 */
import * as Chai from "chai";
import { Electron } from "../../../../../dist/pipelineSteps/platform/electron";

describe("Electron", () => {
    it("can be created", async() => {
        const obj = new Electron();
        Chai.should().exist(obj);
    });
});
