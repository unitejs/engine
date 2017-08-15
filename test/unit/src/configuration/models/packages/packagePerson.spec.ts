/**
 * Tests for PackagePerson.
 */
import * as Chai from "chai";
import { PackagePerson } from "../../../../../../dist/configuration/models/packages/packagePerson";

describe("PackagePerson", () => {
    it("can be created", async() => {
        const obj = new PackagePerson();
        Chai.should().exist(obj);
    });
});
