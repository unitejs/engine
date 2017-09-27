/**
 * Tests for {GEN_NAME_PASCAL} service.
 */
import * as chaiModule from "chai";
const chai = (chaiModule as any).default || chaiModule;
import { {GEN_NAME_PASCAL}Service } from "{GEN_UNIT_TEST_RELATIVE}{GEN_NAME_SNAKE}{ADDITIONAL_EXTENSION}";

describe("{GEN_NAME_PASCAL}Service", () => {
    it("can be created", () => {
        const obj = new {GEN_NAME_PASCAL}Service();
        chai.should().exist(obj);
    });
});
