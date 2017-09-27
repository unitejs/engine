/**
 * Tests for {GEN_NAME_PASCAL}ValueConverter.
 */
import * as chaiModule from "chai";
const chai = (chaiModule as any).default || chaiModule;
import { {GEN_NAME_PASCAL}ValueConverter } from "{GEN_UNIT_TEST_RELATIVE}{GEN_NAME_SNAKE}";

describe("{GEN_NAME_PASCAL}ValueConverter", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}ValueConverter();
        chai.should().exist(obj);
    });
});
