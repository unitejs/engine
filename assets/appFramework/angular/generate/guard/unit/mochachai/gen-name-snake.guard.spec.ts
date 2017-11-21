/**
 * Tests for GenNamePascal guard.
 */
import /* Synthetic Import */ chai from "chai";
import { GenNamePascalGuard } from "../../src/gen-name-snake.guard";

describe("GenNamePascalGuard", () => {
    it("can be created", () => {
        const obj = new GenNamePascalGuard();
        chai.should().exist(obj);
    });
});
