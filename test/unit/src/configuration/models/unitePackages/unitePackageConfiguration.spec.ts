/**
 * Tests for UnitePackageConfiguration.
 */
import * as Chai from "chai";
import { UnitePackageConfiguration } from "../../../../../../src/configuration/models/unitePackages/unitePackageConfiguration";

describe("UnitePackageConfiguration", () => {
    it("can be created", async() => {
        const obj = new UnitePackageConfiguration();
        Chai.should().exist(obj);
    });
});
