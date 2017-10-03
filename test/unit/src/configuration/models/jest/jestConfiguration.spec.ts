/**
 * Tests for JestConfiguration.
 */
import * as Chai from "chai";
import { JestConfiguration } from "../../../../../../src/configuration/models/jest/jestConfiguration";

describe("JestConfiguration", () => {
    it("can be created", async() => {
        const obj = new JestConfiguration();
        Chai.should().exist(obj);
    });
});
