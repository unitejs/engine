/**
 * Tests for {GEN_NAME_PASCAL} pipe.
 */
import chai from "chai";
import { {GEN_NAME_PASCAL}Pipe } from "{GEN_UNIT_TEST_RELATIVE}{GEN_NAME_SNAKE}{ADDITIONAL_EXTENSION}";

describe("{GEN_NAME_PASCAL}Pipe", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}Pipe();
        chai.should().exist(obj);
    });
});
