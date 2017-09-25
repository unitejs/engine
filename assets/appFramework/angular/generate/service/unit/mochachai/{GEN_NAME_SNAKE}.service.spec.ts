/**
 * Tests for {GEN_NAME_PASCAL} service.
 */
import chai from "chai";
import { {GEN_NAME_PASCAL}Service } from "{GEN_TEST_RELATIVE}{GEN_NAME_SNAKE}.service";

describe("{GEN_NAME_PASCAL}Service", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}Service();
        chai.should().exist(obj);
    });
});
