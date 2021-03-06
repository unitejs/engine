/**
 * Child class.
 *
 * @export
 * @class Child
 */
export class Child {
    /**
     * Message displayed in the view.
     * @type {string}
     */
    message;

    /**
     * Creates an instance of Child.
     */
    constructor() {
        this.message = "Hello UniteJS World!";
    }

    /**
     * Render the component.
     * @returns {void}
     */
    render(parent) {
        const style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(".child { font-size: 20px }"));
        parent.appendChild(style);

        const elem = document.createElement("span");
        elem.innerText = this.message;
        elem.className = "child";
        parent.appendChild(elem);
    }
}

/* Generated by UniteJS */
