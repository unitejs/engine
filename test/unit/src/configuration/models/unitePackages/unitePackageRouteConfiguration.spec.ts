/**
 * Tests for UnitePackageRouteConfiguration.
 */
import * as Chai from "chai";
import { UnitePackageRouteConfiguration } from "../../../../../../src/configuration/models/unitePackages/unitePackageRouteConfiguration";

describe("UnitePackageConfiguration", () => {
    it("can be created", async() => {
        const obj = new UnitePackageRouteConfiguration();
        Chai.should().exist(obj);
    });
});
