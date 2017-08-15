/**
 * Tests for TypeScript.
 */
import * as Chai from "chai";
import { TypeScript } from "../../../../../dist/pipelineSteps/language/typeScript";

describe("TypeScript", () => {
    it("can be created", async() => {
        const obj = new TypeScript();
        Chai.should().exist(obj);
    });
});
