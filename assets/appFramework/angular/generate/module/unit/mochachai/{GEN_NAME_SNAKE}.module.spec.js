/**
 * Tests for {GEN_NAME_PASCAL}Module.
 */
import chai from "chai";
import { {GEN_NAME_PASCAL}Module } from "{GEN_TEST_RELATIVE}{GEN_NAME_SNAKE}.module";

describe("{GEN_NAME_PASCAL}Module", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}Module();
        chai.should().exist(obj);
    });
});
