/**
 * Tests for HtmlTemplate.
 */
import * as Chai from "chai";
import { HtmlTemplate } from "../../../../../dist/pipelineSteps/content/htmlTemplate";

describe("HtmlTemplate", () => {
    it("can be created", async() => {
        const obj = new HtmlTemplate();
        Chai.should().exist(obj);
    });
});
