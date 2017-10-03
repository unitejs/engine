/**
 * Tests for JestConfigurationCoverageThreshold.
 */
import * as Chai from "chai";
import { JestConfigurationCoverageThreshold } from "../../../../../../src/configuration/models/jest/jestConfigurationCoverageThreshold";

describe("JestConfigurationCoverageThreshold", () => {
    it("can be created", async() => {
        const obj = new JestConfigurationCoverageThreshold();
        Chai.should().exist(obj);
    });
});
