/**
 * Tests for Main.
 */
import Chai from "chai";
import { entryPoint } from "../../../src/main";

describe("Main", () => {
    it("should contain entryPoint", (done) => {
        Chai.should().exist(entryPoint);
        done();
    });
});