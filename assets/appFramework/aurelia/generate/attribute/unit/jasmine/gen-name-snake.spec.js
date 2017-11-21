/**
 * Tests for GenNamePascalAttribute.
 */
import {GenNamePascalAttribute} from "../../src/gen-name-snake";

describe("GenNamePascalAttribute", () => {
    it("can be created", () => {
        const obj = new GenNamePascalAttribute(undefined);
        expect(obj).toBeDefined();
    });
});
