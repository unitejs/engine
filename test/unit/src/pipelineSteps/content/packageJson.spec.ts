/**
 * Tests for PackageJson.
 */
import * as Chai from "chai";
import { PackageJson } from "../../../../../dist/pipelineSteps/content/packageJson";

describe("PackageJson", () => {
    it("can be created", async() => {
        const obj = new PackageJson();
        Chai.should().exist(obj);
    });
});
