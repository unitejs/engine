/**
 * Tests for EngineVariablesHtml.
 */
import * as Chai from "chai";
import { EngineVariablesHtml } from "../../../../dist/engine/engineVariablesHtml";

describe("EngineVariablesHtml", () => {
    it("can be created", async() => {
        const obj = new EngineVariablesHtml();
        Chai.should().exist(obj);
    });
});
