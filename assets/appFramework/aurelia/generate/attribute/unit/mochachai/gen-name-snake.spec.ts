/**
 * Tests for GenNamePascalAttribute.
 */
import chai from "chai";
import { GenNamePascalAttribute } from "../../src/gen-name-snake";

describe("GenNamePascalAttribute", () => {
    it("can be created", () => {
        const obj = new GenNamePascalAttribute(undefined);
        chai.should().exist(obj);
    });
});
