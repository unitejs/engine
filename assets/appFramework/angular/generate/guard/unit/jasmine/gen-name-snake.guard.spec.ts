/**
 * Tests for GenNamePascal guard.
 */
import { GenNamePascalGuard } from "../../src/gen-name-snake.guard";

describe("GenNamePascalGuard", () => {
    it("can be created", () => {
        const obj = new GenNamePascalGuard();
        expect(obj).toBeDefined();
    });
});
