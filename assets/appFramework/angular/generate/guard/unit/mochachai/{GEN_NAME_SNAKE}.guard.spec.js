/**
 * Tests for {GEN_NAME_PASCAL} guard.
 */
import chai from "chai";
import { {GEN_NAME_PASCAL}Guard } from "{GEN_TEST_RELATIVE}{GEN_NAME_SNAKE}.guard";

describe("{GEN_NAME_PASCAL}Guard", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}Guard();
        chai.should().exist(obj);
    });
});
