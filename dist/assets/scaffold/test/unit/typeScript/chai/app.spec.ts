/**
 * Tests for App.
 */
import * as Chai from "chai";
import { entryPoint } from "../../../../dist/app";

describe("App", () => {
    it("can be created", async(done) => {
        const app = new App();
        Chai.should().exist(app);
        done();
    });
});