/**
 * Tests for UniteThemeConfiguration.
 */
import * as Chai from "chai";
import { UniteThemeConfiguration } from "../../../../../../dist/configuration/models/uniteTheme/uniteThemeConfiguration";

describe("UniteThemeConfiguration", () => {
    it("can be created", async() => {
        const obj = new UniteThemeConfiguration();
        Chai.should().exist(obj);
    });
});
