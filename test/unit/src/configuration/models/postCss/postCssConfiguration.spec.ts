/**
 * Tests for PostCssConfiguration.
 */
import * as Chai from "chai";
import { PostCssConfiguration } from "../../../../../../src/configuration/models/postcss/postCssConfiguration";

describe("PostCssConfiguration", () => {
    it("can be created", async() => {
        const obj = new PostCssConfiguration();
        Chai.should().exist(obj);
    });
});
