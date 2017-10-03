/**
 * Tests for TypeScriptConfiguration.
 */
import * as Chai from "chai";
import { TypeScriptConfiguration } from "../../../../../../src/configuration/models/typeScript/typeScriptConfiguration";

describe("TypeScriptConfiguration", () => {
    it("can be created", async() => {
        const obj = new TypeScriptConfiguration();
        Chai.should().exist(obj);
    });
});
