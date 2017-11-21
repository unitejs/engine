/**
 * Tests for GenNamePascal directive.
 */
import {GenNamePascalDirective} from "../../src/gen-name-snake.directive";

describe("GenNamePascalDirective", () => {
    it("can be created", () => {
        const obj = new GenNamePascalDirective();
        expect(obj).toBeDefined();
    });
});
