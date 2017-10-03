/**
 * Tests for TypeScriptCompilerOptions.
 */
import * as Chai from "chai";
import { TypeScriptCompilerOptions } from "../../../../../../src/configuration/models/typeScript/typeScriptCompilerOptions";

describe("TypeScriptCompilerOptions", () => {
    it("can be created", async() => {
        const obj = new TypeScriptCompilerOptions();
        Chai.should().exist(obj);
    });
});
