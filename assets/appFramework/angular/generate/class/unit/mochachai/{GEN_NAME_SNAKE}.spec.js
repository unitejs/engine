/**
 * Tests for {GEN_NAME_PASCAL}.
 */
import chai from "chai";
import { {GEN_NAME_PASCAL} } from "{GEN_TEST_ROOT}src/{GEN_SUB_FOLDER}{GEN_NAME_SNAKE}";

describe("{GEN_NAME_PASCAL}", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}();
        chai.should().exist(obj);
    });
});
