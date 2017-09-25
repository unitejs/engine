/**
 * Tests for {GEN_NAME_PASCAL} enum.
 */
import chai from "chai";
import { {GEN_NAME_PASCAL}Enum } from "{GEN_TEST_RELATIVE}{GEN_NAME_SNAKE}.enum";

describe("{GEN_NAME_PASCAL}Enum", () => {
    it("can be created", () => {
        chai.should().exist({GEN_NAME_PASCAL}Enum);
    });
});
