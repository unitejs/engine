/**
 * Tests for Webpack.
 */
import * as Chai from "chai";
import { Webpack } from "../../../../../dist/pipelineSteps/bundler/webpack";

describe("Webpack", () => {
    it("can be created", async() => {
        const obj = new Webpack();
        Chai.should().exist(obj);
    });
});
