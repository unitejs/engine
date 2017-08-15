/**
 * Tests for React.
 */
import * as Chai from "chai";
import { React } from "../../../../../dist/pipelineSteps/applicationFramework/react";

describe("React", () => {
    it("can be created", async() => {
        const obj = new React();
        Chai.should().exist(obj);
    });
});
