/**
 * Tests for GenNamePascal pipe.
 */
import chai from "chai";
import { GenNamePascalPipe } from "../../src/gen-name-snake.pipe";

describe("GenNamePascalPipe", () => {
    it("can be created", () => {
        const obj = new GenNamePascalPipe();
        chai.should().exist(obj);
    });
});
