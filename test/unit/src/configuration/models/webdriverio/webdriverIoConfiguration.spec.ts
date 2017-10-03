/**
 * Tests for WebdriverIoConfiguration.
 */
import * as Chai from "chai";
import { WebdriverIoConfiguration } from "../../../../../../src/configuration/models/webdriverIo/webdriverIoConfiguration";

describe("WebdriverIoConfiguration", () => {
    it("can be created", async() => {
        const obj = new WebdriverIoConfiguration();
        Chai.should().exist(obj);
    });
});
