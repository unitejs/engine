/**
 * Tests for E2eTestScaffold.
 */
import * as Chai from "chai";
import { E2eTestScaffold } from "../../../../../dist/pipelineSteps/scaffold/e2eTestScaffold";

describe("E2eTestScaffold", () => {
    it("can be created", async() => {
        const obj = new E2eTestScaffold();
        Chai.should().exist(obj);
    });
});
