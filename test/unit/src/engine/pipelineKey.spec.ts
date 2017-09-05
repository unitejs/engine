/**
 * Tests for PipelineKey.
 */
import * as Chai from "chai";
import { PipelineKey } from "../../../../dist/engine/pipelineKey";

describe("PipelineKey", () => {
    it("can be created", () => {
        const obj = new PipelineKey("1", "2");
        Chai.should().exist(obj);
        Chai.expect(obj.category).to.be.equal("1");
        Chai.expect(obj.key).to.be.equal("2");
    });
});
