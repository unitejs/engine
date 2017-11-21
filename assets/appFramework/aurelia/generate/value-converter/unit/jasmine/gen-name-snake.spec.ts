/**
 * Tests for GenNamePascalValueConverter.
 */
import { GenNamePascalValueConverter } from "../../src/gen-name-snake";

describe("GenNamePascalValueConverter", () => {
    it("can be created", () => {
        const obj = new GenNamePascalValueConverter();
        expect(obj).toBeDefined();
    });
});
