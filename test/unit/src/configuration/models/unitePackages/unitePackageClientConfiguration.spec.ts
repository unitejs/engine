/**
 * Tests for UnitePackageClientConfiguration.
 */
import * as Chai from "chai";
import { UnitePackageClientConfiguration } from "../../../../../../src/configuration/models/unitePackages/unitePackageClientConfiguration";

describe("UnitePackageClientConfiguration", () => {
    it("can be created", async() => {
        const obj = new UnitePackageClientConfiguration();
        Chai.should().exist(obj);
    });
});
