/**
 * Tests for App.
 */
describe("App", () => {
    it("the title is set", (done) => {
        const uniteJson = require("../../../unite.json");
        browser.get("/")
            .then(() => {
                browser.getTitle()
                    .then((title) => {
                        expect(title).toEqual(uniteJson.title);
                        done();
                    });
            });
    });

    it("the body text is set", (done) => {
        browser.get("/")
            .then(() => {
                browser.element(by.css("body")).getText()
                    .then((bodyContent) => {
                        expect(bodyContent).toEqual("Hello JavaScript UniteJS World!");
                        done();
                    });
            });
    });
});

/* Generated by UniteJS */
