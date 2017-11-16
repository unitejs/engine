/**
 * Tests for LessHintConfiguration.
 */
import * as Chai from "chai";
import { LessHintConfiguration } from "../../../../../../src/configuration/models/lessHint/lessHintConfiguration";

describe("LessHintConfiguration", () => {
    it("can be created", async() => {
        const obj = new LessHintConfiguration();
        Chai.should().exist(obj);
    });
});
