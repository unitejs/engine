/**
 * Tests for EsDocConfiguration.
 */
import * as Chai from "chai";
import { EsDocConfiguration } from "../../../../../../src/configuration/models/esDoc/esDocConfiguration";

describe("EsDocConfiguration", () => {
    it("can be created", async() => {
        const obj = new EsDocConfiguration();
        Chai.should().exist(obj);
    });
});
