/**
 * Tests for StyleLintConfiguration.
 */
import * as Chai from "chai";
import { StyleLintConfiguration } from "../../../../../../src/configuration/models/styleLint/styleLintConfiguration";

describe("StyleLintConfiguration", () => {
    it("can be created", async() => {
        const obj = new StyleLintConfiguration();
        Chai.should().exist(obj);
    });
});
