/**
 * Tests for UnitePackageCondition.
 */
import * as Chai from "chai";
import { UnitePackageCondition } from "../../../../../../src/configuration/models/unitePackages/unitePackageCondition";

describe("UnitePackageCondition", () => {
    it("can be created", async() => {
        const obj = new UnitePackageCondition();
        Chai.should().exist(obj);
    });
});
