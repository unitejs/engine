/**
 * Tests for StylintConfiguration.
 */
import * as Chai from "chai";
import { StylintConfiguration } from "../../../../../../src/configuration/models/stylint/stylintConfiguration";

describe("StylintConfiguration", () => {
    it("can be created", async() => {
        const obj = new StylintConfiguration();
        Chai.should().exist(obj);
    });
});
