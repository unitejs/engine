/**
 * Tests for ConfigHelper.
 */
import * as Chai from "chai";
import { ConfigHelper } from "../../../../src/engine/configHelper";

describe("ConfigHelper", () => {
    it("can be created", () => {
        const obj = new ConfigHelper();
        Chai.should().exist(obj);
    });
});
