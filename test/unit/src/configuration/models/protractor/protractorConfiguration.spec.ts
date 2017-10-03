/**
 * Tests for ProtractorConfiguration.
 */
import * as Chai from "chai";
import { ProtractorConfiguration } from "../../../../../../src/configuration/models/protractor/protractorConfiguration";

describe("ProtractorConfiguration", () => {
    it("can be created", async() => {
        const obj = new ProtractorConfiguration();
        Chai.should().exist(obj);
    });
});
