/**
 * Tests for UniteWwwDirectories.
 */
import * as Chai from "chai";
import { UniteWwwDirectories } from "../../../../../../dist/configuration/models/unite/uniteWwwDirectories";

describe("UniteWwwDirectories", () => {
    it("can be created", async() => {
        const obj = new UniteWwwDirectories();
        Chai.should().exist(obj);
    });
});
