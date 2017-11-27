/**
 * Gen Name Human component class.
 *
 * @export
 * @class GenNamePascal
 */
import { Component, h } from "preact";
import "./gen-name-snake.css";

export class GenNamePascal extends Component<any, any> {
    /**
     * Message displayed in the view.
     * @type {string}
     */
    public message: string;

    /**
     * Creates an instance of GenNamePascal.
     */
    constructor() {
        super();
        this.message = "Hello Gen Name Human";
    }

    /**
     * Render the component.
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <span className="gen-name-snake">{this.message}</span>;
    }
}
