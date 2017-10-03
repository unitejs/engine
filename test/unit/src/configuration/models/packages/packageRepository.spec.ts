/**
 * Tests for PackageRepository.
 */
import * as Chai from "chai";
import { PackageRepository } from "../../../../../../src/configuration/models/packages/packageRepository";

describe("PackageRepository", () => {
    it("can be created", async() => {
        const obj = new PackageRepository();
        Chai.should().exist(obj);
    });
});
