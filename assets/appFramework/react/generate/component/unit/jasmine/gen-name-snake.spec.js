/**
 * Tests for GenNamePascal.
 */
import {GenNamePascal} from "../../src/gen-name-snake";

describe("GenNamePascal", () => {
    it("can be created", () => {
        const obj = new GenNamePascal(undefined, undefined);
        expect(obj).toBeDefined();
    });
});
