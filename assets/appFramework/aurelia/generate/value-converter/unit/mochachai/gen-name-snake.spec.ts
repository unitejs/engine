/**
 * Tests for GenNamePascalValueConverter.
 */
import /* Synthetic Import */ chai from "chai";
import { GenNamePascalValueConverter } from "../../src/gen-name-snake";

describe("GenNamePascalValueConverter", () => {
    it("can be created", () => {
        const obj = new GenNamePascalValueConverter();
        chai.should().exist(obj);
    });
});
