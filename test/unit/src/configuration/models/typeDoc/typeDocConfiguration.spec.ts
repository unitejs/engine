/**
 * Tests for TypeDocConfiguration.
 */
import * as Chai from "chai";
import { TypeDocConfiguration } from "../../../../../../src/configuration/models/typeDoc/typeDocConfiguration";

describe("TypeDocConfiguration", () => {
    it("can be created", async() => {
        const obj = new TypeDocConfiguration();
        Chai.should().exist(obj);
    });
});
