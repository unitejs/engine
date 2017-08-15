/**
 * Tests for EsLintConfiguration.
 */
import * as Chai from "chai";
import { EsLintConfiguration } from "../../../../../../dist/configuration/models/eslint/esLintConfiguration";

describe("EsLintConfiguration", () => {
    it("can be created", async() => {
        const obj = new EsLintConfiguration();
        Chai.should().exist(obj);
    });
});
