/**
 * Tests for GenNamePascal pipe.
 */
import {GenNamePascalPipe} from "../../src/gen-name-snake.pipe";

describe("GenNamePascalPipe", () => {
    it("can be created", () => {
        const obj = new GenNamePascalPipe();
        expect(obj).toBeDefined();
    });
});
