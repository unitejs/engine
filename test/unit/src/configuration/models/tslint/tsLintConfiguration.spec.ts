/**
 * Tests for TsLintConfiguration.
 */
import * as Chai from "chai";
import { TsLintConfiguration } from "../../../../../../dist/configuration/models/tslint/tsLintConfiguration";

describe("TsLintConfiguration", () => {
    it("can be created", async() => {
        const obj = new TsLintConfiguration();
        Chai.should().exist(obj);
    });
});
