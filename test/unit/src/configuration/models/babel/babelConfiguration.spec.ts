/**
 * Tests for BabelConfiguration.
 */
import * as Chai from "chai";
import { BabelConfiguration } from "../../../../../../src/configuration/models/babel/babelConfiguration";

describe("BabelConfiguration", () => {
    it("can be created", async() => {
        const obj = new BabelConfiguration();
        Chai.should().exist(obj);
    });
});
