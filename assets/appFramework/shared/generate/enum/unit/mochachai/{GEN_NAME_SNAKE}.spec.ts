/**
 * Tests for {GEN_NAME_PASCAL} enum.
 */
import * as chaiModule from "chai";
const chai = (chaiModule as any).default || chaiModule;
import { {GEN_NAME_PASCAL}Enum } from "{GEN_UNIT_TEST_RELATIVE}{GEN_NAME_SNAKE}{ADDITIONAL_EXTENSION}";

describe("{GEN_NAME_PASCAL}Enum", () => {
    it("can be created", () => {
        chai.should().exist({GEN_NAME_PASCAL}Enum);
    });
});
