/**
 * Tests for EngineVariables.
 */
import * as Chai from "chai";
import { EngineVariables } from "../../../../dist/engine/engineVariables";

describe("EngineVariables", () => {
    it("can be created", async() => {
        const obj = new EngineVariables();
        Chai.should().exist(obj);
    });
});
