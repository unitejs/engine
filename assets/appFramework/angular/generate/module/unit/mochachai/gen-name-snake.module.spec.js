/**
 * Tests for GenNamePascalModule.
 */
import chai from "chai";
import {GenNamePascalModule} from "../../src/gen-name-snake.module";

describe("GenNamePascalModule", () => {
    it("can be created", () => {
        const obj = new GenNamePascalModule();
        chai.should().exist(obj);
    });
});
