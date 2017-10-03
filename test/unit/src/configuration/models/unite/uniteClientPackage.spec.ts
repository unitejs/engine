/**
 * Tests for UniteClientPackage.
 */
import * as Chai from "chai";
import { UniteClientPackage } from "../../../../../../src/configuration/models/unite/uniteClientPackage";

describe("UniteClientPackage", () => {
    it("can be created", async() => {
        const obj = new UniteClientPackage();
        Chai.should().exist(obj);
    });
});
