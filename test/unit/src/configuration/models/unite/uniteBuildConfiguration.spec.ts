/**
 * Tests for UniteBuildConfiguration.
 */
import * as Chai from "chai";
import { UniteBuildConfiguration } from "../../../../../../dist/configuration/models/unite/uniteBuildConfiguration";

describe("UniteBuildConfiguration", () => {
    it("can be created", async() => {
        const obj = new UniteBuildConfiguration();
        Chai.should().exist(obj);
    });
});
