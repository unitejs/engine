/**
 * Tests for Main.
 */
import * as Chai from "chai";
import { entryPoint } from "../../../src/main";

describe("Main", () => {
    it("should contain entryPoint", (done) => {
        Chai.should().exist(entryPoint);
        done();
    });
});