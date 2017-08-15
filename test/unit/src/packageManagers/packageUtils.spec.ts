/**
 * Tests for PackageUtils.
 */
import * as Chai from "chai";
import { PackageUtils } from "../../../../dist/packageManagers/packageUtils";

describe("PackageUtils", () => {
    it("can be created", async() => {
        const obj = new PackageUtils();
        Chai.should().exist(obj);
    });
});
