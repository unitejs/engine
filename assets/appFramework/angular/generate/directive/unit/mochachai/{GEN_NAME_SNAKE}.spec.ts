/**
 * Tests for {GEN_NAME_PASCAL} directive.
 */
import chai from "chai";
import { {GEN_NAME_PASCAL}Directive } from "{GEN_UNIT_TEST_RELATIVE}{GEN_NAME_SNAKE}{ADDITIONAL_EXTENSION}";

describe("{GEN_NAME_PASCAL}Directive", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}Directive();
        chai.should().exist(obj);
    });
});
