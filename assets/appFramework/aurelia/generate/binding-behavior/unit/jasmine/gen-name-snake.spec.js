/**
 * Tests for GenNamePascalBindingBehavior.
 */
import {GenNamePascalBindingBehavior} from "../../src/gen-name-snake";

describe("GenNamePascalBindingBehavior", () => {
    it("can be created", () => {
        const obj = new GenNamePascalBindingBehavior();
        expect(obj).toBeDefined();
    });
});
