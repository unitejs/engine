/**
 * Tests for ProtractorCapabilities.
 */
import * as Chai from "chai";
import { ProtractorCapabilities } from "../../../../../../src/configuration/models/protractor/protractorCapabilities";

describe("ProtractorCapabilities", () => {
    it("can be created", async() => {
        const obj = new ProtractorCapabilities();
        Chai.should().exist(obj);
    });
});
