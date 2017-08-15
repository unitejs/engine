/**
 * Tests for License.
 */
import * as Chai from "chai";
import { License } from "../../../../../dist/pipelineSteps/content/license";

describe("License", () => {
    it("can be created", async() => {
        const obj = new License();
        Chai.should().exist(obj);
    });
});
