/**
 * Tests for HtmlTemplateConfiguration.
 */
import * as Chai from "chai";
import { HtmlTemplateConfiguration } from "../../../../../../dist/configuration/models/htmlTemplate/htmlTemplateConfiguration";

describe("HtmlTemplateConfiguration", () => {
    it("can be created", async() => {
        const obj = new HtmlTemplateConfiguration();
        Chai.should().exist(obj);
    });
});
