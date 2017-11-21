/**
 * Tests for GenNamePascalBindingBehavior.
 */
import chai from "chai";
import {GenNamePascalBindingBehavior} from "../../src/gen-name-snake";

describe("GenNamePascalBindingBehavior", () => {
    it("can be created", () => {
        const obj = new GenNamePascalBindingBehavior();
        chai.should().exist(obj);
    });
});
