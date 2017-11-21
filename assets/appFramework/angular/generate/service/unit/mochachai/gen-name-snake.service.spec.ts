/**
 * Tests for GenNamePascal service.
 */
import /* Synthetic Import */ chai from "chai";
import { GenNamePascalService } from "../../src/gen-name-snake.service";

describe("GenNamePascalService", () => {
    it("can be created", () => {
        const obj = new GenNamePascalService();
        chai.should().exist(obj);
    });
});
