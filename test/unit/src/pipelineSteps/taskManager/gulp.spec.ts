/**
 * Tests for Gulp.
 */
import * as Chai from "chai";
import { Gulp } from "../../../../../dist/pipelineSteps/taskManager/gulp";

describe("Gulp", () => {
    it("can be created", async() => {
        const obj = new Gulp();
        Chai.should().exist(obj);
    });
});
