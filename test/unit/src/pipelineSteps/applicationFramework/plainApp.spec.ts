/**
 * Tests for PlainApp.
 */
import * as Chai from "chai";
import { PlainApp } from "../../../../../dist/pipelineSteps/applicationFramework/plainApp";

describe("PlainApp", () => {
    it("can be created", async() => {
        const obj = new PlainApp();
        Chai.should().exist(obj);
    });
});
