/**
 * Tests for AppScaffold.
 */
import * as Chai from "chai";
import { AppScaffold } from "../../../../../dist/pipelineSteps/scaffold/appScaffold";

describe("AppScaffold", () => {
    it("can be created", async() => {
        const obj = new AppScaffold();
        Chai.should().exist(obj);
    });
});
