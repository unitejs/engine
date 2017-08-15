/**
 * Tests for UniteDirectories.
 */
import * as Chai from "chai";
import { UniteDirectories } from "../../../../../../dist/configuration/models/unite/uniteDirectories";

describe("UniteDirectories", () => {
    it("can be created", async() => {
        const obj = new UniteDirectories();
        Chai.should().exist(obj);
    });
});
