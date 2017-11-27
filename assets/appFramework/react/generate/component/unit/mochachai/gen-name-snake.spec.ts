/**
 * Tests for GenNamePascal.
 */
import /* Synthetic Import */ chai from "chai";
import { GenNamePascal } from "../../src/gen-name-snake";

describe("GenNamePascal", () => {
    it("can be created", () => {
        const obj = new GenNamePascal();
        chai.should().exist(obj);
    });
});
