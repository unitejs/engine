/**
 * Tests for GenNamePascalComponent.
 */
import chai from "chai";
import {GenNamePascalComponent} from "../../src/gen-name-snake.component";

describe("GenNamePascalComponent", () => {
    it("can be created", () => {
        const obj = new GenNamePascalComponent();
        chai.should().exist(obj);
    });
});
