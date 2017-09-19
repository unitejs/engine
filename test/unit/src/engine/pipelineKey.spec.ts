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

    describe("combined", () => {
        it("can called", () => {
            const obj = new PipelineKey("1", "2");
            const res = obj.combined();
            Chai.expect(res).to.be.equal("1/2");
        });
    });

    describe("matches", () => {
        it("can match successfully", () => {
            const obj = new PipelineKey("1", "2");
            const obj2 = new PipelineKey("1", "2");
            const res = obj.matches(obj2);
            Chai.expect(res).to.be.equal(true);
        });

        it("can fail to match", () => {
            const obj = new PipelineKey("1", "2");
            const obj2 = new PipelineKey("2", "1");
            const res = obj.matches(obj2);
            Chai.expect(res).to.be.equal(false);
        });
    });
});
