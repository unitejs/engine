/**
 * Tests for {GEN_NAME_PASCAL}.
 */
import chai from "chai";
import { {GEN_NAME_PASCAL} } from "{GEN_UNIT_TEST_RELATIVE}{GEN_NAME_SNAKE}";

describe("{GEN_NAME_PASCAL}", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}(undefined, undefined);
        chai.should().exist(obj);
    });
});
