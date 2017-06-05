/**
 * Tests for App.
 */
import * as Chai from "chai";
import { App } from "../../../src/app";

describe("App", () => {
    it("can be created", (done) => {
        const app = new App();
        Chai.should().exist(app);
        done();
    });
});