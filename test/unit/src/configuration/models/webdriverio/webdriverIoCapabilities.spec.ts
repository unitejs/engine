/**
 * Tests for WebdriverIoCapabilities.
 */
import * as Chai from "chai";
import { WebdriverIoCapabilities } from "../../../../../../dist/configuration/models/webdriverIo/webdriverIoCapabilities";

describe("WebdriverIoCapabilities", () => {
    it("can be created", async() => {
        const obj = new WebdriverIoCapabilities();
        Chai.should().exist(obj);
    });
});
