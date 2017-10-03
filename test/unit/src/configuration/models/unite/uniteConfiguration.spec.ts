/**
 * Tests for UniteConfiguration.
 */
import * as Chai from "chai";
import { UniteConfiguration } from "../../../../../../src/configuration/models/unite/uniteConfiguration";

describe("UniteConfiguration", () => {
    it("can be created", async() => {
        const obj = new UniteConfiguration();
        Chai.should().exist(obj);
    });
});
