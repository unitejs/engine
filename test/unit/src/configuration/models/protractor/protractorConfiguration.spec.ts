/**
 * Tests for ProtractorConfiguration.
 */
import * as Chai from "chai";
import { ProtractorConfiguration } from "../../../../../../dist/configuration/models/protractor/protractorConfiguration";

describe("ProtractorConfiguration", () => {
    it("can be created", async() => {
        const obj = new ProtractorConfiguration();
        Chai.should().exist(obj);
    });
});
