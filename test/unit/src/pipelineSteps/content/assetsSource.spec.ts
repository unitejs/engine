/**
 * Tests for AssetsSource.
 */
import * as Chai from "chai";
import { AssetsSource } from "../../../../../dist/pipelineSteps/content/assetsSource";

describe("AssetsSource", () => {
    it("can be created", async() => {
        const obj = new AssetsSource();
        Chai.should().exist(obj);
    });
});
