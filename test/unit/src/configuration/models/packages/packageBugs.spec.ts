/**
 * Tests for PackageBugs.
 */
import * as Chai from "chai";
import { PackageBugs } from "../../../../../../dist/configuration/models/packages/packageBugs";

describe("PackageBugs", () => {
    it("can be created", async() => {
        const obj = new PackageBugs();
        Chai.should().exist(obj);
    });
});
