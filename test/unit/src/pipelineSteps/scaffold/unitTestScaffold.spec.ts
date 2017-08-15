/**
 * Tests for UnitTestScaffold.
 */
import * as Chai from "chai";
import { UnitTestScaffold } from "../../../../../dist/pipelineSteps/scaffold/unitTestScaffold";

describe("UnitTestScaffold", () => {
    it("can be created", async() => {
        const obj = new UnitTestScaffold();
        Chai.should().exist(obj);
    });
});
