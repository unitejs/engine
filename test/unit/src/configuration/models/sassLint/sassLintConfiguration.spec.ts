/**
 * Tests for SassLintConfiguration.
 */
import * as Chai from "chai";
import { SassLintConfiguration } from "../../../../../../src/configuration/models/sassLint/sassLintConfiguration";

describe("SassLintConfiguration", () => {
    it("can be created", async() => {
        const obj = new SassLintConfiguration();
        Chai.should().exist(obj);
    });
});
