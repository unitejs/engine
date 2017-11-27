/**
 * Gen Name Human component class.
 *
 * @export
 * @class GenNamePascal
 */
import /* Synthetic Import */ React from "react";
import "./gen-name-snake.css";

export class GenNamePascal extends React.Component {
    /**
     * Message displayed in the view.
     * @type {string}
     */
    public message: string;

    /**
     * Creates an instance of GenNamePascal.
     */
    constructor() {
        super(undefined, undefined);
        this.message = "Hello Gen Name Human";
    }

    /**
     * Render the component.
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <span className="gen-name-snake">{ this.message }</span>;
    }
}
