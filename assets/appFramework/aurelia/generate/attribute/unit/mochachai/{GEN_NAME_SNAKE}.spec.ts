/**
 * Tests for {GEN_NAME_PASCAL}Attribute.
 */
import chai from "chai";
import { {GEN_NAME_PASCAL}Attribute } from "{GEN_UNIT_TEST_RELATIVE}{GEN_NAME_SNAKE}";

describe("{GEN_NAME_PASCAL}Attribute", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}Attribute(undefined);
        chai.should().exist(obj);
    });
});
