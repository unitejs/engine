/**
 * Tests for esLintParserOptions.
 */
import * as Chai from "chai";
import { EsLintParserOptions } from "../../../../../../dist/configuration/models/eslint/esLintParserOptions";

describe("EsLintParserOptions", () => {
    it("can be created", async() => {
        const obj = new EsLintParserOptions();
        Chai.should().exist(obj);
    });
});
