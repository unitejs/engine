/**
 * Tests for GenNamePascalModule.
 */
import { GenNamePascalModule } from "../../src/gen-name-snake.module";

describe("GenNamePascalModule", () => {
    it("can be created", () => {
        const obj = new GenNamePascalModule();
        expect(obj).toBeDefined();
    });
});
