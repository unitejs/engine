/**
 * Tests for KarmaConfiguration.
 */
import * as Chai from "chai";
import { KarmaConfiguration } from "../../../../../../dist/configuration/models/karma/karmaConfiguration";

describe("KarmaConfiguration", () => {
    it("can be created", async() => {
        const obj = new KarmaConfiguration();
        Chai.should().exist(obj);
    });
});
