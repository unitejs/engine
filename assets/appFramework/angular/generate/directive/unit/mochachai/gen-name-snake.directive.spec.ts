/**
 * Tests for GenNamePascal directive.
 */
import chai from "chai";
import { GenNamePascalDirective } from "../../src/gen-name-snake.directive";

describe("GenNamePascalDirective", () => {
    it("can be created", () => {
        const obj = new GenNamePascalDirective();
        chai.should().exist(obj);
    });
});
