/**
 * Tests for Main.
 */
import * as ChaiModule from "chai";
const Chai = (ChaiModule as any).default || ChaiModule;
import { entryPoint } from "../../../src/main";

describe("Main", () => {
    it("should contain entryPoint", (done) => {
        Chai.should().exist(entryPoint);
        done();
    });
});
