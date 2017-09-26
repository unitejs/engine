/**
 * Tests for {GEN_NAME_PASCAL}BindingBehavior.
 */
import chai from "chai";
import { {GEN_NAME_PASCAL}BindingBehavior } from "{GEN_UNIT_TEST_RELATIVE}{GEN_NAME_SNAKE}";

describe("{GEN_NAME_PASCAL}BindingBehavior", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}BindingBehavior();
        chai.should().exist(obj);
    });
});
