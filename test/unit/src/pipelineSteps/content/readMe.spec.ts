/**
 * Tests for ReadMe.
 */
import * as Chai from "chai";
import { ReadMe } from "../../../../../dist/pipelineSteps/content/readMe";

describe("ReadMe", () => {
    it("can be created", async() => {
        const obj = new ReadMe();
        Chai.should().exist(obj);
    });
});
