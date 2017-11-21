/**
 * Tests for GenNamePascal service.
 */
import {GenNamePascalService} from "../../src/gen-name-snake.service";

describe("GenNamePascalService", () => {
    it("can be created", () => {
        const obj = new GenNamePascalService();
        expect(obj).toBeDefined();
    });
});
