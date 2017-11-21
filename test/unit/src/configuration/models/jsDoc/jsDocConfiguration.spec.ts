/**
 * Tests for JsDocConfiguration.
 */
import * as Chai from "chai";
import { JsDocConfiguration } from "../../../../../../src/configuration/models/jsDoc/jsDocConfiguration";

describe("JsDocConfiguration", () => {
    it("can be created", async() => {
        const obj = new JsDocConfiguration();
        Chai.should().exist(obj);
    });
});
